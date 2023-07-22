const db = require("../utils/db");

const suspendAccount = (accountId) => {
  const suspendAccountQuery =
    "update accounts set status='Suspended' where id=$1 returning strikes";

  return db.query(suspendAccountQuery, [accountId]);
};

const updateAccountStrikes = async (accountId) => {
  const updateQuery =
    "update accounts set strikes = strikes + 1 where id=$1 returning strikes";

  const result = await db.query(updateQuery, [accountId]);

  if (result.rowCount === 0) {
    throw new Error(`Account not found for account id - ${accountId}`);
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
    throw new Error(`Invalid blacklist table - '${blacklistTable}'.`);
  }

  const table = `blacklisted_${blacklistTable}`;
  const existingRecords = await db.query(
    `select id from ${table} where dentist_id=$1 and patient_id=$2`,
    [dentistId, patientId]
  );

  if (existingRecords.rows.length === 0) {
    const insertQuery = `insert into ${table} (dentist_id, patient_id, reason) values($1,$2,$3)`;
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
    "select * from blacklisted_patients order by patient_id,created_at desc";
  const result = await db.query(query);

  return result.rows;
};

const getBlacklistedDentists = async () => {
  const query =
    "select * from blacklisted_dentists order by dentist_id,created_at desc";

  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  blacklistDentist,
  blacklistPatient,
  getBlacklistedDentists,
  getBlacklistedPatients,
};
