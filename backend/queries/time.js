/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */

// Get all hours banked by a volunteer
const allBankedHours = async (volunteer) => {
    const selectQuery = `
    SELECT banked_time 
    FROM volunteers_hours 
    WHERE volunteer_id = $/volunteer/ AND deleted IS NULL
  `;
    return await db.one(selectQuery, {volunteer});
}

// Get all hours planned by a volunteer
const allPlannedHours = async (volunteer) => {
    const selectQuery = `
    SELECT planned_time 
    FROM volunteers_hours 
    WHERE volunteer_id = $/volunteer/ AND deleted IS NULL
    `;
    return await db.one(selectQuery, {volunteer});
}

//Get the number of hours by all volunteers (response is an array of objects)
const allHours = async () => {
  const selectQuery = `
  SELECT banked_time 
  FROM volunteers_hours
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
    allBankedHours,
    allPlannedHours,
    allHours,
    deleteHoursByVolunteerId
}
