const db = require("../utils/db");

const scheduleAppointment = async (id, dentist, date, start, end) => {
  const checkAppointmentQuery =
    "SELECT appointment_date, start_time, status FROM appointments WHERE dentist_id = $1 AND appointment_date=$2 AND start_time=$3";

  const result = await db.query(checkAppointmentQuery, [dentist, date, start]);
  const appointments = result.rows;
  if (appointments.rows.length !== 0) {
    appointments.forEach((appointment) => {
      if (
        appointment.status === "Pending" ||
        appointment.status === "Accepted" ||
        appointment.status === "Completed"
      ) {
        throw new Error("Dentist is not available during this period!");
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
    start,
    end,
    "Pending",
    title,
  ]);
};

module.exports = { scheduleAppointment };
