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
    SELECT banked_hours 
    FROM volunteer_hours 
    WHERE volunteer = $/volunteer/
  `;
    return await db.one(selectQuery, {volunteer});
}

// Get all hours planned by a volunteer
const allPlannedHours = async (volunteer) => {
    const selectQuery = `
    SELECT planned_time 
    FROM volunteer_hours 
    WHERE volunteer = $/volunteer/
    `;
    return await db.one(selectQuery);
}

//Get the number of hours by all volunteers 
const allHours = async () => {
  const selectQuery = `
  SELECT banked_hours 
  FROM volunteer_hours
  `;
  return await db.one(selectQuery);
}



/* EXPORT */
module.exports = {
    allBankedHours,
    allPlannedHours,
    allHours
}
