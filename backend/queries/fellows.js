/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');


/*
// f_id SERIAL PRIMARY KEY,
f_first_name VARCHAR (30) NOT NULL,
f_last_name VARCHAR (30) NOT NULL,
// f_email VARCHAR (50) REFERENCES users_data(user_email),
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
  const getQuery = `
    SELECT *
    FROM fellows
    WHERE f_id = $/fId/;
  `;
  return await db.one(getQuery, { fId });
}

// const addFellow = async (bodyObj) => {
//   const postQuery = `
//     INSERT INTO fellows (
//         f_first_name,
//         f_last_name,
//         f_picture,
//         f_bio,
//         f_linkedin,
//         f_github,
//         cohort_id,
//         want_mentor
//     ) VALUES (
//         $/firstname/,
//         $/lastname/,
//         $/picture/,
//         $/bio/,
//         $/linkedIn/,
//         $/github/,
//         $/cohortId/,
//         $/wantMentor/
//     )
//     RETURNING *;
//   `;
//   return await db.one(postQuery, bodyObj);
// }


/* EXPORT */
module.exports = {
  getAllFellows,
  getFellowById,
  // addFellow
}
