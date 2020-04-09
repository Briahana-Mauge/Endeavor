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
  return await db.task( async t => {
      const checkQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM cohorts
            WHERE cohort = $1
        );
      `;
      const doesCohortExist = await t.one(checkQuery, cohort);
      if (doesCohortExist.exists === false) {
        const postQuery = `
          INSERT INTO cohorts ( cohort ) VALUES ( $1 )
          RETURNING *;
        `;
        return await t.one(postQuery, cohort);
      } else {
        throw new Error('403__cohort already exists');
      }
  });
}

const updateCohort = async (cohortObj) => {
  return await db.task( async t => {
      // check if wanted name exists first aside from target id
      const checkQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM cohorts
            WHERE cohort_id <> $/cohortId/ AND cohort = $/cohort/
        );
      `;
      const doesCohortExist = await t.one(checkQuery, cohortObj);
      // if wanted name already exists aside from target id, throw error to prev duplicate
      if (doesCohortExist.exists === false) {
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
