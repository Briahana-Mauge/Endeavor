/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
COHORTS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */
const selectAllCohorts = async () => {
  const getQuery = `
    SELECT *
    FROM cohorts
    WHERE deleted IS NULL
    ORDER BY cohort_id ASC;
  `;
  return await db.any(getQuery);
}

const selectCohortById = async (id) => {
  const getQuery = `
    SELECT *
    FROM cohorts
    WHERE cohort_id = $/id/
    ORDER BY cohort_id ASC;
  `;
  return await db.any(getQuery, {id});
}

const insertCohort = async (cohort) => {
  return await db.task( async t => {
      const checkQuery = `
      SELECT *
      FROM cohorts
      WHERE cohort = $1;
      `;
      const existingCohort = await t.oneOrNone(checkQuery, cohort);
      // if doesn't exist then allow the add
      if (!existingCohort) {
        const postQuery = `
          INSERT INTO cohorts ( cohort ) VALUES ( $1 )
          RETURNING *;
        `;
        return await t.one(postQuery, cohort);
        // else if it exists but it was marked as deleted then update it and bring it back as non-deleted
      } else if (existingCohort && existingCohort.deleted) {
        const updateQuery = `
          UPDATE cohorts
          SET deleted = NULL
          WHERE cohort_id = $1
          RETURNING *;
        `;
        return await t.one(updateQuery, existingCohort.cohort_id);
      } else {
        throw new Error('403__cohort already exists');
      }
  });
}

const updateCohort = async (cohortObj) => {
  return await db.task( async t => {
      // check if wanted name exists first aside from target id
      const checkQuery = `
      SELECT *
      FROM cohorts
      WHERE cohort_id <> $/cohortId/ AND cohort = $/cohort/;
      `;
      const existingCohort = await t.oneOrNone(checkQuery, cohortObj);
      // if wanted name already exists aside from target id, throw error to prev duplicate
      if (!existingCohort || existingCohort.deleted) {
        const updateQuery = `
          UPDATE cohorts
          SET cohort = $/cohort/
          WHERE cohort_id = $/cohortId/
          RETURNING *;
        `;
        return await t.one(updateQuery, cohortObj);
      } else {
        throw new Error('403__cohort already exists');
      }
  });
}

const deleteCohort = async (cohortId) => {
  const deleteQuery = `
    UPDATE cohorts
    SET deleted = NOW()
    WHERE cohort_id = $1
    RETURNING *;
  `;
  return await db.one(deleteQuery, cohortId);
}


/* EXPORT */
module.exports = {
  selectAllCohorts,
  selectCohortById,
  insertCohort,
  updateCohort,
  deleteCohort
}
