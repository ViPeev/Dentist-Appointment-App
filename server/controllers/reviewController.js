const db = require("../utils/db");

const reviewDentist = async (
  { details, dentistId, appointmentId },
  patientId
) => {
  //Check if already reviewd
  const selectReview =
    "SELECT appointment_id FROM dentist_reviews WHERE appointment_id = $1";

  const findReview = await db.query(selectReview, [appointmentId]);
  if (findReview.rows.length !== 0) {
    throw new Error("Dentist has already been reviewd!");
  }

  const createReviewQuery =
    "INSERT INTO dentist_reviews(dentist_id, patient_id, patient_comment, appointment_id) VALUES($1, $2, $3, $4)";

  await db.query(createReviewQuery, [
    dentistId,
    patientId,
    details,
    appointmentId,
  ]);
};

const getReviews = async (dentistId) => {
  const selectReviews = `
  SELECT dentist_reviews.patient_id, patient_comment, commented_on, accounts.first_name, accounts.last_name 
  FROM dentist_reviews
  JOIN patients ON dentist_reviews.patient_id=patients.account_id
  JOIN accounts ON patients.account_id=accounts.id
  WHERE dentist_reviews.dentist_id = $1;
  `;

  const result = await db.query(selectReviews, [dentistId]);
  return result.rows;
};

const getReviewsDentist = async (dentistId) => {
  const selectReviews = `
  SELECT dentist_reviews.patient_id, patient_comment, commented_on, accounts.first_name, accounts.last_name 
  FROM dentist_reviews
  JOIN patients ON dentist_reviews.patient_id=patients.account_id
  JOIN accounts ON patients.account_id=accounts.id
  WHERE dentist_reviews.dentist_id = $1;
  `;

  const result = await db.query(selectReviews, [dentistId]);
  return result.rows;
};

module.exports = { reviewDentist, getReviews, getReviewsDentist };
