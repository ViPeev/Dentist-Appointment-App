const db = require("../utils/db");
const bcrypt = require("bcrypt");
const config = require("../config");
const { sign } = require("../utils/jsonwebtoken");
const { ValidationError } = require("../utils/errorClass");

//insert to role db tables

const insertByRole = async (email) => {
  const findQuery = "SELECT id, role_id FROM accounts WHERE email=$1";

  const result = await db.query(findQuery, [email]);
  const role = result.rows[0].role_id;
  if (role === 2) {
    const insertDentist = "INSERT INTO DENTISTS(account_id) VALUES($1)";
    await db.query(insertDentist, [result.rows[0].id]);
  }

  if (role === 3) {
    const insertPatient = "INSERT INTO PATIENTS(account_id) VALUES($1)";
    await db.query(insertPatient, [result.rows[0].id]);
  }
};

//login
const login = async (email, password) => {
  const findQuery = "SELECT * FROM accounts WHERE email=$1";
  const result = await db.query(findQuery, [email]);

  if (result.rows.length === 0) {
    throw new ValidationError("Invalid email or password! - 400");
  }

  const account = result.rows[0];
  if (account.status.trim().toLowerCase() !== "active") {
    throw new ValidationError("Account is suspended! - 403");
  }

  const isPassValid = await bcrypt.compare(password, account.pwd);
  if (!isPassValid) {
    throw new ValidationError("Invalid E-mail or password! - 400");
  }

  const payload = {
    id: account.id,
    role: account.role_id,
    firstName: account["first_name"],
    lastName: account["last_name"],
    email: account.email,
    image: null,
  };

  const token = await sign(payload, config.JWT_SECRET, { expiresIn: "48h" });
  return { accessToken: token, ...payload };
};

//register

const register = async (firstName, lastName, email, password, role) => {
  const findQuery = "SELECt email FROM accounts WHERE email=$1";
  const createQuery =
    "INSERT INTO accounts(first_name, last_name, email, pwd, role_id) VALUES($1, $2, $3, $4, $5)";

  const result = await db.query(findQuery, [email]);

  if (result.rows.length !== 0) {
    throw new ValidationError("E-mail is already taken! - 400");
  }

  const hashPass = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

  await db.query(createQuery, [firstName, lastName, email, hashPass, role]);
  await insertByRole(email);

  return login(email, password);
};

module.exports = { login, register };
