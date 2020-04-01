/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/*
f_id SERIAL PRIMARY KEY,
f_first_name VARCHAR (30) NOT NULL,
f_last_name VARCHAR (30) NOT NULL,
f_email VARCHAR (30) NOT NULL,
*** f_password VARCHAR NOT NULL,
f_picture VARCHAR,
f_bio VARCHAR,
f_linkedin VARCHAR (150),
f_github VARCHAR (150),
cohort INT REFERENCES classes(class_id),
want_mentor BOOLEAN NOT NULL DEFAULT FALSE
*/


/* QUERIES */

// Get all volunteers
const getAllVolunteers = async () => {
    const selectQuery = `
    SELECT *
    FROM volunteers
    ORDER BY v_first_name ASC;
  `;
    return await db.any(selectQuery);
}

// Get all new (unconfirmed) volunteers
const getNewVolunteers = async () => {
    const selectQuery = `
      SELECT *
      FROM volunteers
      WHERE confirmed = FALSE
      ORDER BY v_first_name ASC;
    `;
    return await db.any(selectQuery);
}

// Get all volunteers by some filter

// Patch volunteer confirmed status to true or false

// Patch volunteer active status to true or false


/*
const formatStr = str => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}
*/

/* EXPORT */
module.exports = {
    getAllVolunteers,
    getNewVolunteers