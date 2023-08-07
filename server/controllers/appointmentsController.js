const db = require("../utils/db");
const { ValidationError } = require("../utils/errorClass");

//patient requests a new appointment /7
const scheduleAppointmentPatient = async (
  id,
  dentist,
  date,
  startTime,
  endTime
) => {
  const checkAppointmentQuery =
    "SELECT appointment_date, start_time, status FROM appointments WHERE dentist_id = $1 AND appointment_date=$2 AND start_time=$3";

  const result = await db.query(checkAppointmentQuery, [
    dentist,
    date,
    startTime,
  ]);
  const appointments = result.rows;
  if (appointments.length !== 0) {
    appointments.forEach((appointment) => {
      if (
        appointment.status === "Pending" ||
        appointment.status === "Accepted" ||
        appointment.status === "Completed"
      ) {
        throw new ValidationError(
          "Dentist is not available during this period! - 400"
        );
      }
    });
  }

  //Get patient details
  const getPatientDetailsQuery =
    "SELECT first_name, last_name, email FROM accounts WHERE id=$1";
  const getPatientDetailsResult = await db.query(getPatientDetailsQuery, [id]);
  const patientDetails = getPatientDetailsResult.rows[0];

  const title = `${patientDetails.first_name} ${patientDetails.last_name} - ID: ${id}`;

  //Request appointment
  const insertAppointmentQuery =
    "INSERT INTO appointments (dentist_id, patient_id, appointment_date, start_time, end_time, status, title) VALUES ($1,$2,$3,$4,$5,$6,$7)";

  await db.query(insertAppointmentQuery, [
    dentist,
    id,
    date,
    startTime,
    endTime,
    "Pending",
    title,
  ]);
};

//update status on appointment either from patient or dentist 8,9,10,11
const updateAppointmentStatus = async (
  dentistId,
  patientId,
  appointmentId,
  status
) => {
  const updateStatusQuery =
    "UPDATE appointments SET status=$1 WHERE dentist_id=$2 AND patient_id=$3 AND id=$4";

  await db.query(updateStatusQuery, [
    status,
    dentistId,
    parseInt(patientId),
    parseInt(appointmentId),
  ]);
};

//all appointments for patient view /1
const getAppointmentsPatient = async (patientId) => {
  const getAppointmentDetailsQuery = `
    SELECT appointments.id, dentist_id, appointment_date, start_time, end_time, appointments.status, accounts.first_name, accounts.last_name, accounts.email, dentists.phone, dentists.city
    FROM appointments
    JOIN dentists ON appointments.dentist_id=dentists.account_id
    JOIN accounts ON dentists.account_id=accounts.id
    WHERE patient_id=$1;
    `;

  const result = await db.query(getAppointmentDetailsQuery, [patientId]);

  return result.rows;
};

//single appointment for dentist view /4
const getAppointmentPatient = async (appointmentId) => {
  const getAppointmentDetailsQuery = `
    SELECT appointments.id, dentist_id, appointment_date, start_time, end_time, appointments.status, accounts.first_name, accounts.last_name, accounts.email
    FROM appointments
    JOIN dentists ON appointments.dentist_id=dentists.account_id
    JOIN accounts ON dentists.account_id=accounts.id
    WHERE appointments.id=$1;
    `;

  const result = await db.query(getAppointmentDetailsQuery, [appointmentId]);
  return result.rows[0];
};

//single appointment for patient view /5
const getAppointmentDentist = async (appointmentId) => {
  const getAppointmentDetailsQuery = `
    SELECT appointments.id, patient_id, appointment_date, start_time, end_time, appointments.status, accounts.first_name, accounts.last_name, accounts.email
    FROM appointments
    JOIN patients ON appointments.patient_id=patients.account_id
    JOIN accounts ON patients.account_id=accounts.id
    WHERE appointments.id=$1;
      `;

  const result = await db.query(getAppointmentDetailsQuery, [
    parseInt(appointmentId),
  ]);

  return result.rows[0];
};

//get all appointments for patient calendar widget /3
const getCalendarAppointmentsPatient = async (dentistId) => {
  const selectAppointments =
    "SELECT id, appointment_date, start_time, end_time, status FROM appointments WHERE (dentist_id = $1) AND (status=$2 OR status=$3 OR status=$4)";

  const result = await db.query(selectAppointments, [
    dentistId,
    "Accepted",
    "Pending",
    "Completed",
  ]);

  return result.rows;
};

//get pending appointments for dentist /2
const getPendingAppointmentsDentist = async (dentistId) => {
  const getPendingPatients = `
    SELECT appointments.id, patient_id, appointment_date, start_time, end_time, appointments.status, accounts.first_name, accounts.last_name, accounts.email
    FROM appointments
    JOIN patients ON appointments.patient_id=patients.account_id
    JOIN accounts ON patients.account_id=accounts.id
    WHERE dentist_id=$1;
    `;

  const result = await db.query(getPendingPatients, [dentistId]);
  return result.rows;
};

//6
const getCalendarAppointmentDentist = async (id) => {
  const selectAppointments =
    "SELECT id, title, appointment_date, start_time, end_time, status FROM appointments WHERE (dentist_id = $1) AND (status = $2 OR status = $3 OR status = $4)";

  const result = await db.query(selectAppointments, [
    id,
    "Accepted",
    "Pending",
    "Completed",
  ]);

  return result.rows;
};

module.exports = {
  getAppointmentsPatient,
  getPendingAppointmentsDentist,
  getCalendarAppointmentsPatient,
  getAppointmentDentist,
  getAppointmentPatient,
  getCalendarAppointmentDentist,
  scheduleAppointmentPatient,
  updateAppointmentStatus,
};
