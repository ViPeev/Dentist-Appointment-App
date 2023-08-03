const db = require("../utils/db");

const getBlacklist = async (accountId, term) => {
  const searchParams = [accountId];
  let searchQuery = "";

  if (term) {
    searchQuery =
      " AND first_name ilike $2 OR last_name ilike $2 OR email ilike $2";
    searchParams.push(`%${term}%`);
  }

  const getBlacklistQuery = `
    SELECT
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
    FROM blacklisted_dentists
    LEFT JOIN accounts
    ON dentist_id=accounts.id
    LEFT JOIN dentists
    ON account_id=dentist_id
    WHERE
      blacklisted_dentists.patient_id=$1
    ${searchQuery}
  `;

  const result = await db.query(getBlacklistQuery, searchParams);
  return result.rows;
};

const removeFromBlacklist = async (accountId, dentistId) => {
  const deleteQuery =
    "DELETE FROM blacklisted_dentists WHERE dentist_id = $1 AND patient_id = $2";
  await db.query(deleteQuery, [dentistId, accountId]);
};

module.exports = { getBlacklist, removeFromBlacklist };
