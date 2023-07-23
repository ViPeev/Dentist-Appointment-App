const db = require("../utils/db");

const roles = require("../utils/roles");

const getAll = async (accountId, term) => {
  const dentists = [];
  let searchQuery =
    "select id,first_name,last_name,email,description,city,dentist_type,phone from accounts join dentists on dentists.account_id=accounts.id where role_id=$1";
  const calculateRatingQuery =
    "select AVG(rating)::numeric(10,1) as dentist_rating from dentist_ratings where dentist_id=$1";
  let searchParams = [roles.DENTIST];

  if (term && term.length !== 0) {
    searchQuery +=
      " and (first_name ilike $2 or last_name ilike $2 or email ilike $2)";
    searchParams.push(`%${term}%`);
  }

  const searchResult = await db.query(searchQuery, searchParams);
  dentists = searchResult.rows;

  for (const dentist of dentists) {
    try {
      const dentistRating = await db.query(calculateRatingQuery, [dentist.id]);
      dentist.rating = dentistRating.rows[0].dentist_rating;
    } catch (error) {
      dentist.rating = 0;
    }
  }

  const filteredDentists = [];

  for (const dentist of dentists) {
    const result = await db.query(
      "select id from blacklisted_dentists where dentist_id=$1 and patient_id=$2",
      [dentist.id, accountId]
    );

    if (result.rows.length === 0) {
      filteredDentists.push(dentist);
    }
  }

  return filteredDentists;
};

const getDentistDetails = async (accountId) => {
  const result = await db.query("select * from dentists where account_id=$1", [
    accountId,
  ]);

  return result.rows[0];
};

const getSelectedDentistFullDetails = async (dentistId) => {
  const query =
    "SELECT id, first_name, last_name, email, description, city, dentist_type, phone, work_from, work_to, work_days FROM accounts JOIN dentists ON dentists.account_id=accounts.id WHERE account_id=$1";

  const result = await db.query(query, [dentistId]);

  return result.rows[0];
};

const updateDentistDetails = async (
  { type, city, phone, description },
  dentistId
) => {
  // if (!type && !city && !phone && !description) {
  //   return {
  //     status: "error",
  //     statusmsg: "Bad Request!",
  //   };
  // }

  if (type) {
    const updateTypeQuery =
      "UPDATE dentists SET dentist_type=$1 WHERE account_id=$2";
    await db.query(updateTypeQuery, [type, dentistId]);
  }

  if (city) {
    const updateCityQuery = "UPDATE dentists SET city=$1 WHERE account_id=$2";
    await db.query(updateCityQuery, [city, dentistId]);
  }

  if (phone) {
    const updatePhoneQuery = "UPDATE dentists SET phone=$1 WHERE account_id=$2";
    await db.query(updatePhoneQuery, [phone, dentistId]);
  }

  if (description) {
    const updateDescriptionQuery =
      "UPDATE dentists SET description=$1 WHERE account_id=$2";
    await db.query(updateDescriptionQuery, [description, dentistId]);
  }
};

const updateWorkDetails = async (days, start, end, dentistId) => {
  const updateWorkQuery =
    "UPDATE dentists SET work_days=$1, work_from=$2, work_to=$3 WHERE account_id=$4";

  await db.query(updateWorkQuery, [days, start, end, dentistId]);

  return { days, start, end };
};

const getBlacklist = async (dentistId) => {
  const getBlacklistQuery = `
    select 
      dentist_id,
      patient_id,
      reason,
      blacklisted_patients.created_at as blacklist_date,
      email,
      first_name,
      last_name,
      status
    from blacklisted_patients
    left join accounts
    on patient_id=accounts.id
    where
      blacklisted_patients.dentist_id=$1
  `;

  const result = await db.query(getBlacklistQuery, [dentistId]);
  return result.rows;
};

const removeFromBlacklist = async (dentistId, patientId) => {
  const removeQuery =
    "delete from blacklisted_patients where patient_id = $1 and dentist_id = $2";
  await db.query(removeQuery, [patientId, dentistId]);
};

module.exports = {
  getAll,
  getDentistDetails,
  getSelectedDentistFullDetails,
  updateDentistDetails,
  updateWorkDetails,
  getBlacklist,
  removeFromBlacklist,
};
