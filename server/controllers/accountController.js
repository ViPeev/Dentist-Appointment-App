const config = require("../config");
const { ValidationError } = require("../utils/errorClass");
const db = require("../utils/db");
const bcrypt = require("bcrypt");

const updateDetails = async ({ firstName, lastName, email, image, id }) => {
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
      throw new ValidationError("E-mail is already taken! - 400");
    }

    await db.query(changeEmailQuery, [email, id]);
    updated.email = email;
  }

  if (image) {
    const updateLastNameQuery = "UPDATE accounts SET image=$1 WHERE id=$2";
    await db.query(updateLastNameQuery, [image, id]);

    updated.image = image;
  }

  return updated;
};

const updatePassword = async (oldPass, newPass, id) => {
  const getCurrentPassword = "SELECT pwd FROM accounts WHERE id=$1";
  const updatePassword = "UPDATE accounts SET pwd=$1 WHERE id=$2";

  const result = await db.query(getCurrentPassword, [id]);
  const currentPassword = result.rows[0];
  const isPassCorrect = await bcrypt.compare(oldPass, currentPassword.pwd);

  if (!isPassCorrect) {
    throw new ValidationError("Current password is incorrect! - 401");
  }

  const newHashPass = await bcrypt.hash(newPass, config.BCRYPT_ROUNDS);
  await db.query(updatePassword, [newHashPass, id]);
};

module.exports = { updateDetails, updatePassword };
