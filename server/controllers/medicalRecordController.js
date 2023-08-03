const db = require("../utils/db");

const createRecord = async (
  { details, patientId, appointmentId },
  dentistId
) => {
  const createMedicalRecord =
    "INSERT INTO medical_records(patient_id, dentist_id, details, appointment_id) VALUES($1, $2, $3, $4)";

  await db.query(createMedicalRecord, [
    patientId,
    dentistId,
    details,
    appointmentId,
  ]);
};

const getPatients = async (dentistId) => {
  const selectPatientsQuery = `
  SELECT DISTINCT medical_records.patient_id, accounts.first_name, accounts.last_name, AVG(patient_ratings.rating)::numeric(10,1) 
  FROM medical_records
  JOIN patients ON medical_records.patient_id=patients.account_id
  JOIN accounts ON patients.account_id=accounts.id
  JOIN patient_ratings ON patients.account_id = patient_ratings.patient_id
  WHERE medical_records.dentist_id = $1
  GROUP BY medical_records.patient_id, accounts.first_name, accounts.last_name
  `;

  const result = await db.query(selectPatientsQuery, [dentistId]);
  patientList = result.rows;
  const filteredPatients = [];

  // Remove blacklisted patients
  for (const patient of patientList) {
    const queryResult = await db.query(
      "SELECT id FROM blacklisted_patients WHERE patient_id=$1 AND dentist_id=$2",
      [patient.patient_id, dentistId]
    );
    if (queryResult.rows.length === 0) {
      filteredPatients.push(patient);
    }
  }

  return filteredPatients;
};

const getPatientMedicalRecord = async (dentistId, patientId) => {
  const selectMedicalRecordDetails = `
  SELECT accounts.first_name, accounts.last_name, details, medical_records.appointment_id, appointments.appointment_date 
  FROM medical_records
  JOIN patients ON medical_records.patient_id=patients.account_id
  JOIN accounts ON patients.account_id=accounts.id
  JOIN appointments ON medical_records.appointment_id=appointments.id 
  WHERE medical_records.dentist_id = $1 AND medical_records.patient_id = $2`;

  const result = await db.query(selectMedicalRecordDetails, [
    dentistId,
    patientId,
  ]);

  return result.rows;
};

const getDentists = async (patientId) => {
  const selectPatients = `
  SELECT DISTINCT dentist_id, accounts.first_name, accounts.last_name 
  FROM medical_records
  JOIN dentists ON medical_records.dentist_id=dentists.account_id
  JOIN accounts ON dentists.account_id=accounts.id 
  WHERE patient_id = $1`;

  const result = await db.query(selectPatients, [patientId]);
  return result.rows;
};

const getPatientMedicalRecordByDentist = async (patientId, dentistId) => {
  const selectMedicalRecordDetails = `
  SELECT accounts.first_name, accounts.last_name, details, medical_records.appointment_id, appointments.appointment_date 
  FROM medical_records
  JOIN dentists ON medical_records.dentist_id=dentists.account_id
  JOIN accounts ON dentists.account_id=accounts.id
  JOIN appointments ON medical_records.appointment_id=appointments.id 
  WHERE medical_records.dentist_id = $1 AND medical_records.patient_id = $2`;

  const result = await db.query(selectMedicalRecordDetails, [
    dentistId,
    patientId,
  ]);
  return result.rows;
};

module.exports = {
  createRecord,
  getPatients,
  getDentists,
  getPatientMedicalRecord,
  getPatientMedicalRecordByDentist,
};
