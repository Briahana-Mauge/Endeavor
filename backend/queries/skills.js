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
  return await db.task( async t => {
    const checkQuery = `
      SELECT EXISTS (
          SELECT 1
          FROM skills
          WHERE skill = $1
      );
    `;
    const doesSkillExist = await t.one(checkQuery, skill);
    if (doesSkillExist.exists === false) {
      const postQuery = `
        INSERT INTO skills ( skill ) VALUES ( $1 )
        RETURNING *;
      `;
      return await t.one(postQuery, skill);
    } else {
      throw new Error('403__skill already exists');
    }
  });
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
