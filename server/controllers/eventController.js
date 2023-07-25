const db = require("../utils/db");

const getGlobalEvents = async () => {
  const selectAllEvents = "SELECT * FROM global_events ";
  const result = await db.query(selectAllEvents);

  return result.rows;
};

const addGlobalEvent = async (
  { title, description, date, start, end },
  dentistId
) => {
  const createGlobalEvent =
    "INSERT INTO global_events (dentist_id, title, description, event_date, event_start, event_end) VALUES($1, $2, $3, $4, $5, $6)";
  await db.query(createGlobalEvent, [
    dentistId,
    title,
    description,
    date,
    start,
    end,
  ]);
};

module.exports = { getGlobalEvents, addGlobalEvent };
