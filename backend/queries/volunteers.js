/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */

// Get all volunteers
const getAllVolunteers = async () => {
    const selectQuery = `
    SELECT *
    FROM volunteers
    ORDER BY v_first_name ASC
  `;
    return await db.any(selectQuery);
}

// Get all new (unconfirmed) volunteers
const getNewVolunteers = async () => {
    const selectQuery = `
      SELECT *
      FROM volunteers
      WHERE confirmed = FALSE
      ORDER BY v_first_name ASC
    `;
    return await db.any(selectQuery);
}

// Get volunteer by email 
const getVolunteerByEmail = async (vEmail) => {
  const selectQuery = `
  SELECT *
  FROM volunteers
  WHERE v_email = $/vEmail/
  `;
  return await db.one(selectQuery, {vEmail});
}

// Get all volunteers by some filter



/*
const formatStr = str => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}
*/

/* EXPORT */
module.exports = {
    getAllVolunteers,
    getNewVolunteers,
    getVolunteerByEmail
  }
