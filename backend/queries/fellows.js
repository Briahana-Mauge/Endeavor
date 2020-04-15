/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');

const userQueries = require('./users');
// const mentorPairsQueries = require('./mentorPairs');
// const eventFollowsQueries = require('./eventFollows');


/* QUERIES */
const getAllFellows = async (askedForMentor) => {
  const getQuery = `
    SELECT *
    FROM fellows
    $/mentorFilter:raw/
    ORDER BY f_first_name ASC;
  `;
  let mentorFilter = "WHERE deleted IS NULL";
  if (askedForMentor === true) {
    mentorFilter += ` AND want_mentor = TRUE`;
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
    WHERE f_email = $/fEmail/ AND deleted IS NULL;
  `;
  return await db.one(getQuery, { fEmail });
}

const addFellow = async (userObj, newPassword, oldPassword) => {
  // Update the password of the new fellow whom already registered into the users_data
  const registeredUser = await userQueries.updatePassword(userObj.email, newPassword);

  // continues with adding rest of fellow info
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
    return await db.one(postQuery, userObj);
  } catch (err) {
    if (registeredUser) { // if adding the new fellow fails, the password gets reset
        userQueries.updatePassword(postQuery.email, oldPassword);
    }
    throw err;
  }
}

const updateFellow = async (userObj) => {
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
        want_mentor = $/wantMentor/,
        deleted = NULL
    WHERE f_id = $/userId/
    RETURNING *;
  `;
  return await db.one(updateQuery, userObj);
}

const deleteFellow = async (fId) => {
  console.log('ID: ', fId)
  const deleteQuery = `
    UPDATE fellows
    SET deleted = NOW()
    WHERE f_id = $/fId/
    RETURNING *;
  `;

  const promises = [];
  promises.push(db.one(deleteQuery, { fId }));
  // promises.push(eventFollowsQueries.delete...(fId, true));
  // promises.push(mentorPairsQueries.delete...(fId, true));

  const response = await Promise.all(promises);
  return response[0];
}

const deleteFollowByEmail = async (email, promise) => {
  const fellow = await db.one('SELECT * FROM fellows WHERE f_email = $1', email);
  console.log(fellow)
  if (promise) {
    return deleteFellow(fellow.f_id);
  }
  return await deleteFellow(fellow.f_id);
}


/* EXPORT */
module.exports = {
  getAllFellows,
  getFellowById,
  getFellowByEmail,
  addFellow,
  updateFellow,
  deleteFellow,
  deleteFollowByEmail
}