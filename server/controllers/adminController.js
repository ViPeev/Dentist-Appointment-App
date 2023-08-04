const db = require("../utils/db");
const bcrypt = require("bcrypt");
const config = require("../config");
const roles = require("../utils/roles");
const { login } = require("./authController");
const { ValidationError } = require("../utils/customError");

const getDentistDetails = async (dentistId) => {
  const getDetailsQuery = `
 SELECT
    description,
    dentist_type,
    city,phone,
    work_from,
    work_to,
    work_days
  FROM dentists
  WHERE account_id=$1`;

  const result = await db.query(getDetailsQuery, [dentistId]);
  return result.rows[0];
};

const getDentistReviews = async (dentistId) => {
  const getReviewsQuery = `
  SELECT
    accounts.id AS patient_id,
    first_name,
    last_name,
    patient_comment,
    commented_on
  FROM accounts
  LEFT JOIN dentist_reviews
  ON accounts.id=patient_id
  WHERE dentist_reviews.dentist_id=$1`;

  const result = await db.query(getReviewsQuery, [dentistId]);
  return result.rows;
};

const calculateRating = async (accountType, accountId) => {
  const table =
    accountType === roles.DENTIST ? "dentist_ratings" : "patient_ratings";
  const calcQuery = `SELECT AVG(rating)::numeric(10,1) AS account_rating FROM ${table} WHERE dentist_id=$1`;

  const result = await db.query(calcQuery, [accountId]);
  return result.rows[0]["account_rating"] || 0;
};

const compareAdminOldPassword = async (oldPassword, accountId) => {
  const getAccountQuery = "SELECT pwd FROM accounts WHERE id=$1";
  const account = await db.query(getAccountQuery, [accountId]);
  const passwordsMatch = await bcrypt.compare(oldPassword, account.rows[0].pwd);

  return passwordsMatch;
};

const getAdmins = async (accountId) => {
  const getAdminQuery =
    "SELECT id,first_name,last_name,email,status,created_at FROM accounts WHERE role_id=1 and id != $1 ORDER BY created_at DESC";
  const result = await db.query(getAdminQuery, [accountId]);

  return result.rows;
};

const register = async (firstName, lastName, email, password) => {
  const roleId = 1;
  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

  const findQuery = "SELECT email FROM accounts WHERE email=$1";
  const findAccountResult = await db.query(findQuery, findValues);

  if (findAccountResult.rows.length !== 0) {
    throw new ValidationError("E-mail is already taken! - 400");
  }

  const createQuery =
    "INSERT INTO accounts(first_name, last_name, email, pwd, role_id) values($1, $2, $3, $4, $5)";
  await db.query(createQuery, [
    firstName,
    lastName,
    email,
    hashedPassword,
    roleId,
  ]);

  return login(email, password);
};

const getAllAccounts = async (limit) => {
  const getAccountsQuery =
    "SELECT id,email,first_name,last_name,created_at,role_id,status,strikes FROM accounts WHERE role_id != 1 ORDER BY created_at DESC LIMIT $1";

  const result = await db.query(getAccountsQuery, [limit]);
  return result.rows;
};

const getAccountData = async (accountId) => {
  const getAccountQuery =
    "SELECT id,first_name,last_name,email,role_id,status,strikes,created_at FROM accounts WHERE id=$1";

  const result = await db.query(getAccountQuery, [accountId]);

  if (result.rows.length === 0) {
    throw new ValidationError("No account found with the given id! - 404");
  }

  const account = result.rows[0];
  account.reviews = [];

  if (account.role_id === roles.DENTIST) {
    account.details = await getDentistDetails(account.id);
    account.reviews = await getDentistReviews(account.id);
  }

  account.rating = await calculateRating(account.role_id, account.id);
  account.type = account.role_id === roles.DENTIST ? "Dentist" : "Patient";

  return account;
};

const toggleSuspend = async (accountId, state) => {
  const findAccQuery = "SELECT id FROM accounts WHERE id=$1";

  // Check if account with given id exists
  const result = await db.query(findAccQuery, [accountId]);

  if (result.rows.length === 0) {
    throw new ValidationError("No account found with the given id! - 404");
  }

  const updateSuspendState = `UPDATE accounts SET status='${state}' WHERE id=$1`;
  await db.query(updateSuspendState, [accountId]);
};

const deleteAdmin = async (adminId) => {
  const deleteQuery = "DELETE FROM accounts WHERE id=$1 AND role_id=1";
  await db.query(deleteQuery, [adminId]);
};

const changePassword = async (accountId, adminId, newPassword, oldPassword) => {
  const updateQuery = "UPDATE accounts SET pwd=$2 WHERE id=$1";
  const params = [];

  if (!adminId) {
    const passwordsMatch = await compareAdminOldPassword(
      oldPassword,
      accountId
    );

    if (!passwordsMatch) {
      throw new ValidationError("Current password is incorrect! - 401");
    }

    params.push(accountId);
  } else {
    // Admin changes other admin's password
    params.push(adminId);
  }

  const hashPass = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);
  params.push(hashPass);

  await db.query(updateQuery, params);
};

module.exports = {
  toggleSuspend,
  changePassword,
  deleteAdmin,
  getAllAccounts,
  getAccountData,
  getAdmins,
  register,
};
