/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */

// Get all hours banked by a volunteer
const allVolunteeredTimeByVolunteerID = async (volunteer) => {
  const selectQuery = `
    SELECT Extract(MONTH FROM events.event_end) AS months, sum(event_volunteers.volunteered_time) AS hours
    FROM event_volunteers
    INNER JOIN events ON events.event_id = event_volunteers.eventv_id
    WHERE volunteer_id = $/volunteer/ AND event_volunteers.confirmed = TRUE AND Extract(YEAR FROM events.event_end) = Extract(YEAR FROM now())
    GROUP BY Extract(MONTH FROM events.event_end) 
    ORDER BY months
  `;
  return await db.any(selectQuery, { volunteer });
}


//Get the number of hours by all volunteers (response is an array of objects)
const allHours = async () => {
  const selectQuery = `
  SELECT SUM(volunteered_time) 
  FROM event_volunteers
  WHERE deleted IS NULL
  `;
  return await db.any(selectQuery);
}


const deleteHoursByVolunteerId = async (id, promise) => {
  const deleteQuery = `
    UPDATE volunteers_hours
    SET deleted = NOW()
    WHERE volunteer_id = $1
    RETURNING *
  `;

  if (promise) {
    return db.any(deleteQuery, id);
  }
  return await db.any(deleteQuery, id);
}

/* EXPORT */
module.exports = {
  // allVolunteeredTimeByVolunteerID,
  allHours,
  deleteHoursByVolunteerId
}
