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
const getAllFellows = async (name, cohortId, askedForMentor) => {
  const getQuery = `
    SELECT
	    f_id,
	    f_first_name,
	    f_last_name,
	    f_email,
	    f_picture,
	    f_bio,
	    f_linkedin,
	    f_github,
	    want_mentor,
	    fellows.deleted AS fellow_deleted,
	    cohorts.cohort_id,
	    cohorts.cohort,
	    (SELECT JSON_AGG( 
          JSON_BUILD_OBJECT(
	    		  'volunteerId', v_id,
	    		  'name', v_first_name || ' ' || v_last_name,
            'startDate', mentor_pairs.starting_date,
            'endDate', mentor_pairs.deleted
          )
	    	)
	    	FROM volunteers INNER JOIN mentor_pairs ON v_id = mentor
	    	WHERE mentee = f_id AND mentor_pairs.deleted IS NULL
      ) AS mentors_list,
      (SELECT JSON_AGG( 
        JSON_BUILD_OBJECT(
          'volunteerId', v_id,
          'name', v_first_name || ' ' || v_last_name,
          'startDate', mentor_pairs.starting_date,
          'endDate', mentor_pairs.deleted
        )
      )
      FROM volunteers INNER JOIN mentor_pairs ON v_id = mentor
      WHERE mentee = f_id AND mentor_pairs.deleted IS NOT NULL
    ) AS past_mentors_list
      
    FROM fellows INNER JOIN cohorts ON fellows.cohort_id = cohorts.cohort_id
  `;

  let condition = ' WHERE fellows.deleted IS NULL ';
  
  if (name) {
    condition += ` AND LOWER(f_first_name || f_last_name) LIKE '%' || $/name/ || '%' `;
  }

  if (cohortId) {
    condition += ` AND fellows.cohort_id = $/cohortId/ `;
  }

  let mentorFilter = '';
  if (askedForMentor && askedForMentor === 'true') {
    condition  += ` AND want_mentor = TRUE `;
  } else if (askedForMentor) {
    condition  += ` AND want_mentor = FALSE `;
  }

  const endQuery = ' ORDER BY f_first_name ASC ';

  return await db.any(getQuery + condition + endQuery, { name, cohortId, mentorFilter });
}

const getFellowById = async (fId) => {
  const getQuery = `
    SELECT
      f_id,
      f_first_name,
      f_last_name,
      f_email,
      f_picture,
      f_bio,
      f_linkedin,
      f_github,
      want_mentor,
      fellows.deleted AS fellow_deleted,
      cohorts.cohort_id,
      cohorts.cohort,
      (SELECT JSON_AGG( 
          JSON_BUILD_OBJECT(
            'volunteerId', v_id,
            'name', v_first_name || ' ' || v_last_name,
            'startDate', mentor_pairs.starting_date,
            'endDate', mentor_pairs.deleted
          )
        )
        FROM volunteers INNER JOIN mentor_pairs ON v_id = mentor
        WHERE mentee = f_id AND mentor_pairs.deleted IS NULL
      ) AS mentors_list,
      (SELECT JSON_AGG( 
          JSON_BUILD_OBJECT(
            'volunteerId', v_id,
            'name', v_first_name || ' ' || v_last_name,
            'startDate', mentor_pairs.starting_date,
            'endDate', mentor_pairs.deleted
          )
        )
        FROM volunteers INNER JOIN mentor_pairs ON v_id = mentor
        WHERE mentee = f_id AND mentor_pairs.deleted IS NOT NULL
      ) AS past_mentors_list,

      (SELECT ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'eventId', event_id,
            'topic', topic,
            'eventStart', event_start,
            'eventEnd', event_end
          )
        )
        FROM events INNER JOIN event_fellows ON event_id = eventf_id
        WHERE fellow_id = f_id AND event_start < NOW() AND events.deleted IS NULL AND event_fellows.deleted IS NULL
      ) AS events_list
    
    FROM fellows INNER JOIN cohorts ON fellows.cohort_id = cohorts.cohort_id
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
  if (promise) {
    return deleteFellow(fellow.f_id);
  }
  return await deleteFellow(fellow.f_id);
}

const updateViewType = async (userId, targetView) => {
  let updateQuery = `
      UPDATE fellows 
      SET v_grid = NOT v_grid
      WHERE f_id = $/userId/
      RETURNING v_grid
  `

  if (targetView === 'events') {
      updateQuery = `
          UPDATE fellows 
          SET e_grid = NOT e_grid
          WHERE f_id = $/userId/
          RETURNING e_grid
      `
  }

  return await db.one(updateQuery, {userId});
}


/* EXPORT */
module.exports = {
  getAllFellows,
  getFellowById,
  getFellowByEmail,
  addFellow,
  updateFellow,
  deleteFellow,
  deleteFollowByEmail,
  updateViewType
}