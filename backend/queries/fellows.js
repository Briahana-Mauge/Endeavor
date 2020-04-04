/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');

const userQueries = require('./users');

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
const getAllFellows = async (askedForMentor) => {
  const getQuery = `
    SELECT *
    FROM fellows
    $/mentorFilter:raw/
    ORDER BY f_first_name ASC;
  `;
  let mentorFilter = "";
  if (askedForMentor === true) {
    mentorFilter = `WHERE want_mentor = TRUE`;
  }
  return await db.any(getQuery, { mentorFilter });
}

const getFellowById = async (fId) => {
  const getQuery = `
    SELECT *
    FROM fellows
    WHERE f_id = $/fId/;
  `;
  return await db.one(getQuery, { fId });
}

const getFellowByEmail = async (fEmail) => {
  const getQuery = `
    SELECT *
    FROM fellows
    WHERE f_email = $/fEmail/;
  `;
  return await db.one(getQuery, { fEmail });
}

const addFellow = async (user, password) => {
  const registeredUser = await userQueries.addUser(user.email, password, 'fellow');

  const postQuery = `
    INSERT INTO fellows (
        f_first_name,
        f_last_name,
        f_email,
        cohort_id
    ) VALUES (
        $/firstName/,
        $/lastName/,
        $/email/,
        $/cohortId/
    )
    RETURNING *;
  `;

  try {
    return await db.one(postQuery, user);
  } catch (err) {
    if (registeredUser) {
        userQueries.deleteUser(user.email);
    }
    throw err;
}
}

const updateFellow = async (user) => {
  const updateQuery = `
    UPDATE fellows
    SET 
      f_first_name = $/firstName/,
      f_last_name = $/lastName/,
      f_picture = $/picture/,
      f_bio = $/bio/,
      f_linkedin = $/linkedIn/,
      f_github = $/github/,
      cohort_id = $/cohortId/,
      want_mentor = $/wantMentor/
    WHERE f_id = $/userId/
    RETURNING *;
  `;
  return await db.one(updateQuery, user);
}

const deleteFellow = async (id) => {
  return await db.one('DELETE FROM fellows WHERE f_id = $/id/ RETURNING *;', {id});
}


/* EXPORT */
module.exports = {
  getAllFellows,
  getFellowById,
  getFellowByEmail,
  addFellow,
  updateFellow,
  deleteFellow
}
