const db = require("../utils/db");

const updateAccount = async ({ firstName, lastName, email, id }) => {
  const updated = {};

  if (firstName) {
    const updateFirstNameQuery =
      "UPDATE accounts SET first_name=$1 WHERE id=$2";
    await db.query(updateFirstNameQuery, [firstName, id]);

    updated.firstName = firstName;
  }

  if (lastName) {
    const updateLastNameQuery = "UPDATE accounts SET last_name=$1 WHERE id=$2";
    await db.query(updateLastNameQuery, [lastName, id]);

    updated.lastName = lastName;
  }

  if (email) {
    const isEmailTakenQuery = "SELECT email FROM accounts WHERE email=$1";
    const changeEmailQuery = "UPDATE accounts SET email=$1 WHERE id=$2";

    const isEmailTaken = await db.query(isEmailTakenQuery, [email]);

    if (isEmailTaken.rows.length !== 0) {
      throw new Error("E-mail is already taken!");
    }

    await db.query(changeEmailQuery, [email, id]);
    updated.email = email;
  }

  return updated;
};

