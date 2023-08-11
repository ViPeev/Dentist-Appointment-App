const db = require("../utils/db");

const roles = require("../utils/roles");

const getAll = async (accountId, term) => {
  let searchQuery =
    "SELECT id,first_name,last_name,email,description,city,dentist_type,phone FROM accounts JOIN dentists ON dentists.account_id=accounts.id WHERE role_id=$1";
  const calculateRatingQuery =
    "SELECT AVG(rating)::numeric(10,1) AS dentist_rating FROM dentist_ratings WHERE dentist_id=$1";
  let searchParams = [roles.DENTIST];

  if (term && term.length !== 0) {
    searchQuery +=
      " AND (first_name ilike $2 OR last_name ilike $2 OR email ilike $2)";
    searchParams.push(`%${term}%`);
  }

  const searchResult = await db.query(searchQuery, searchParams);
  const dentists = searchResult.rows;

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
      "SELECT id FROM blacklisted_dentists WHERE dentist_id=$1 AND patient_id=$2",
      [dentist.id, accountId]
    );

    if (result.rowCount === 0) {
      filteredDentists.push(dentist);
    }
  }

  return filteredDentists;
};

const getDentistDetails = async (accountId) => {
  const result = await db.query("SELECT * FROM dentists WHERE account_id=$1", [
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
    SELECT 
      dentist_id,
      patient_id,
      reason,
      blacklisted_patients.created_at AS blacklist_date,
      email,
      first_name,
      last_name,
      status
    FROM blacklisted_patients
    LEFT JOIN accounts
    ON patient_id=accounts.id
    WHERE
      blacklisted_patients.dentist_id=$1
  `;

  const result = await db.query(getBlacklistQuery, [dentistId]);
  return result.rows;
};

const removeFromBlacklist = async (dentistId, patientId) => {
  const removeQuery =
    "DELETE FROM blacklisted_patients WHERE patient_id = $1 AND dentist_id = $2";
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
