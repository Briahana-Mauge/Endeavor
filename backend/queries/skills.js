/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
SKILLS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */
const selectAllSkills = async () => {
  const getQuery = `
    SELECT *
    FROM skills
    ORDER BY skill ASC;
  `;
  return await db.any(getQuery);
}

const insertSkill = async (skill) => {
  const postQuery = `
    INSERT INTO skills ( skill ) VALUES ( $1 )
    RETURNING *;
  `;
  return await db.one(postQuery, [skill]);
}

const updateSkill = async (skillObj) => {
  const updateQuery = `
    UPDATE skills
    SET skill = $/skill/
    WHERE skill_id = $/skillId/
    RETURNING *;
  `;
  return await db.one(updateQuery, skillObj);
}

const deleteSkill = async (skillId) => {
  const deleteQuery = `
    DELETE FROM skills
    WHERE skill_id = $1
    RETURNING *;
  `;
  return await db.one(deleteQuery, [skillId]);
}


/* EXPORT */
module.exports = {
  selectAllSkills,
  insertSkill,
  updateSkill,
  deleteSkill
}
