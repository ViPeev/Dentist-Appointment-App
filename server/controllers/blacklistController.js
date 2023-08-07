const { ValidationError } = require("../utils/errorClass");
const db = require("../utils/db");

const suspendAccount = (accountId) => {
  const suspendAccountQuery =
    "UPDATE accounts SET status='Suspended' WHERE id=$1 RETURNING strikes";

  return db.query(suspendAccountQuery, [accountId]);
};

const updateAccountStrikes = async (accountId) => {
  const updateQuery =
    "UPDATE accounts SET strikes = strikes + 1 WHERE id=$1 RETURNING strikes";

  const result = await db.query(updateQuery, [accountId]);

  if (result.rowCount === 0) {
    throw new ValidationError("No account found with the given id! - 404");
  }

  return result.rows[0]["strikes"];
};

const addAccountToBlacklist = async (
  blacklistTable,
  dentistId,
  patientId,
  reason
) => {
  const allowedTables = ["dentists", "patients"];

  if (!allowedTables.includes(blacklistTable)) {
    throw new ValidationError(`Invalid blacklist table - '${blacklistTable}'.`);
  }

  const table = `blacklisted_${blacklistTable}`;
  const existingRecords = await db.query(
    `SELECT id FROM ${table} WHERE dentist_id=$1 AND patient_id=$2`,
    [dentistId, patientId]
  );

  if (existingRecords.rows.length === 0) {
    const insertQuery = `INSERT INTO ${table} (dentist_id, patient_id, reason) VALUES($1,$2,$3)`;
    await db.query(insertQuery, [dentistId, patientId, reason]);
  }
};

const blacklistPatient = async (accountId, patientId, reason) => {
  const patientStrikes = await updateAccountStrikes(patientId);

  if (patientStrikes >= 4) {
    suspendAccount(patientId).catch((error) => console.log(error));
  }

  const table = "patients";
  await addAccountToBlacklist(table, accountId, patientId, reason);
};

const blacklistDentist = async (accountId, dentistId, reason) => {
  const dentistStrikes = await updateAccountStrikes(dentistId);

  if (dentistStrikes >= 4) {
    suspendAccount(dentistId).catch((error) => console.log(error));
  }

  const table = "dentists";
  await addAccountToBlacklist(table, dentistId, accountId, reason);
};

const getBlacklistedPatients = async () => {
  const query =
    "SELECT * FROM blacklisted_patients ORDER BY patient_id,created_at DESC";
  const result = await db.query(query);

  return result.rows;
};

const getBlacklistedDentists = async () => {
  const query =
    "SELECT * FROM blacklisted_dentists ORDER BY dentist_id,created_at DESC";

  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  blacklistDentist,
  blacklistPatient,
  getBlacklistedDentists,
  getBlacklistedPatients,
};
