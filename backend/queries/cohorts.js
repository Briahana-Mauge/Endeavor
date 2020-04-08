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
    ORDER BY cohort_id ASC;
  `;
  return await db.any(getQuery);
}

const insertCohort = async (cohort) => {
  const postQuery = `
    INSERT INTO cohorts ( cohort ) VALUES ( $1 )
    RETURNING *;
  `;
  return await db.one(postQuery, cohort);
}

const updateCohort = async (cohortObj) => {
  const updateQuery = `
    UPDATE cohorts
    SET cohort = $/cohort/
    WHERE cohort_id = $/cohortId/
    RETURNING *;
  `;
  return await db.one(updateQuery, cohortObj);
}

const deleteCohort = async (cohortId) => {
  const deleteQuery = `
    DELETE FROM cohorts
    WHERE cohort_id = $1
    RETURNING *;
  `;
  return await db.one(deleteQuery, cohortId);
}


/* EXPORT */
module.exports = {
  selectAllCohorts,
  insertCohort,
  updateCohort,
  deleteCohort
}
