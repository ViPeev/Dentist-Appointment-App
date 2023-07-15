const db = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

const inserByRole = async (email) => {
  const findQuery = "SELECT id, role_id FROM accounts WHERE email=$1";

  const result = await db.query(findQuery, [email]);

  if (result.role_id === 2) {
    const insertDentist = "INSERT INTO DENTISTS(account_id) VALUES($1)";
    await db.query(insertDentist, [result.id]);
  }

  if (result.role_id === 3) {
    const insertPatient = "INSERT INTO PATIENTS(account_id) VALUES($1)";
    await db.query(insertPatient, [result.id]);
  }
};

const login = async (email, password) => {
  const findQuery =
    "SELECT id, email, pwd, role_id, status FROM accounts WHERE email=$1";
  const result = await db.query(findQuery, [email]);

  if (result.row.length === 0) {
    throw new Error("Invalid email or password!");
  }

  if(result.status.trim().toLowerCase() !== "active"){
    throw new Error("Account is suspended!");
  }

  const isPassValid = await bcrypt.compare(password, result.pwd);
  if(!isPassValid){
    throw new Error("Invalid email or password!");
  }
};

const register = async (firstName, lastName, email, password, role) => {
  const findQuery = "SELECT EMAIL FROM ACCOUNTS WHERE EMAIL=$1";
  const createQuery =
    "INSERT INTO ACCOUNTS(first_name, last_name, email, pwd, role_id) VALUES($1, $2, $3, $4, $5)";

  const result = await db.query(findQuery, [email]);

  if (result.row.length !== 0) {
    throw new Error("E-mail is already taken!");
  }

  const hashPass = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
  await db.query(createQuery, [firstName, lastName, email, hashPass, role]);
  await inserByRole(email);

  return login(email, password);
};
