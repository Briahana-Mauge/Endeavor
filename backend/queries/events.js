/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */


// Get all events (past events are auto pushed to the back)
const getAllEvents = async () => {
  const selectQuery = `
    SELECT *
    FROM events
    ORDER BY (CASE WHEN DATE(event_start) > now()
              THEN 1
              ELSE 0
        END) DESC, event_start ASC
  `;
  return await db.any(selectQuery);
}

// Get all upcoming events
const getUpcomingEvents = async () => {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start > now()
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
}

// Get all past events
const getPastEvents = async () => {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start < now()
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
}


/* EXPORT */
module.exports = {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents
}
