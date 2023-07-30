const db = require("../utils/db");

const ratePatient = async (patientId, patientRating, dentistId) => {
  const createPatientRating =
    "INSERT INTO patient_ratings(patient_id, rating, dentist_id) VALUES($1, $2, $3)";
  await db.query(createPatientRating, [patientId, patientRating, dentistId]);
};

const rateDentist = async (
  patientId,
  dentistRating,
  dentistId,
  appointmentId
) => {
  const selectRating =
    "SELECT appointment_id FROM dentist_ratings WHERE appointment_id = $1";

  const findRating = await db.query(selectRating, [appointmentId]);

  if (findRating.rows.length !== 0) {
    throw new Error("Dentist has already been rated!");
  }

  const createDentistRating =
    "INSERT INTO dentist_ratings(dentist_id, rating, patient_id, appointment_id) VALUES($1, $2, $3, $4)";

  await db.query(createDentistRating, [
    dentistId,
    dentistRating,
    patientId,
    appointmentId,
  ]);
};

const getPatientRating = async (patientId) => {
  const selectPatientRatingAVG =
    "SELECT AVG(rating)::numeric(10,1) FROM patient_ratings WHERE patient_id = $1";

  const result = await db.query(selectPatientRatingAVG, [patientId]);
  return result.rows[0];
};

const getDentistRating = async (dentistID) => {
  const selectDentistRatingAVG =
    "SELECT AVG(rating)::numeric(10,1) FROM dentist_ratings WHERE dentist_id = $1";
  const result = await db.query(selectDentistRatingAVG, [dentistID]);
  return result.rows[0];
};

module.exports = {
  ratePatient,
  rateDentist,
  getPatientRating,
  getDentistRating,
};
