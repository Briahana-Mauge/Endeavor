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
const getAllFellows = async () => {
  const getQuery = `
    SELECT *
    FROM fellows
    ORDER BY f_first_name ASC;
  `;
  return await db.any(getQuery);
}

const getFellowById = async (fId) => {
  try {
    const getQuery = `
      SELECT *
      FROM fellows
      WHERE f_id = $/fId/;
    `;
    return await db.one(getQuery, { fId });
  } catch (err) {
    if (err.message === "No data returned from the query.") {
      throw new Error(`404__error: fellow.${fId} does not exist`);
    }
    throw (err);
  }
}


/* EXPORT */
module.exports = {
  getAllFellows,
  getFellowById
}
