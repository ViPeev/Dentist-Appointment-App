const db = require("../utils/db");

const getBlacklist = async (accountId, term) => {
  const searchParams = [accountId];
  let searchQuery = "";

  if (term) {
    searchQuery =
      " and first_name ilike $2 or last_name ilike $2 or email ilike $2";
    searchParams.push(`%${term}%`);
  }

  const getBlacklistQuery = `
    select 
      dentist_id,
      patient_id,
      reason,
      blacklisted_dentists.created_at as blacklist_date,
      email,
      first_name,
      last_name,
      status,
      city,
      dentist_type
    from blacklisted_dentists
    left join accounts
    on dentist_id=accounts.id
    left join dentists
    on account_id=dentist_id
    where
      blacklisted_dentists.patient_id=$1
    ${searchQuery}
  `;

  const result = await db.query(getBlacklistQuery, searchParams);
  return result.rows;
};

const removeFromBlacklist = async (accountId, dentistId) => {
  const deleteQuery =
    "delete from blacklisted_dentists where dentist_id = $1 and patient_id = $2";
  await db.query(deleteQuery, [dentistId, accountId]);
};

module.exports = { getBlacklist, removeFromBlacklist };
