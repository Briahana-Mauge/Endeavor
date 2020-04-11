/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
SKILLS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');

const volunteerSkillsQuery = require('./volunteerSkills');


/* QUERIES */
const selectAllSkills = async () => {
  const getQuery = `
    SELECT *
    FROM skills
    WHERE deleted IS NULL
    ORDER BY skill ASC;
  `;
  return await db.any(getQuery);
}

const insertSkill = async (skill) => {
  return await db.task( async t => {
    const checkQuery = `
      SELECT *
      FROM skills
      WHERE skill = $1;
    `;
    const existingSkill = await t.oneOrNone(checkQuery, skill);
    if (!existingSkill) {
      const postQuery = `
        INSERT INTO skills ( skill ) VALUES ( $1 )
        RETURNING *;
      `;
      return await t.one(postQuery, skill);
    } else if (existingSkill && existingSkill.deleted) {
      const updateQuery = `
      UPDATE skills 
      SET deleted = NULL
      WHERE skill_id = $1
      RETURNING *;
    `;
    return await t.one(updateQuery, existingSkill.skill_id);
    } else {
      throw new Error('403__skill already exists');
    }
  });
}

const updateSkill = async (skillObj) => {
  return await db.task( async t => {
      // check if wanted name exists first aside from target id
      const checkQuery = `
        SELECT 1
        FROM skills
        WHERE skill_id <> $/skillId/ AND skill = $/skill/;
      `;
      const existingSkill = await t.oneOrNone(checkQuery, skillObj);
      // if wanted name already exists aside from target id, throw error to prev duplicate
      if (!existingSkill || existingSkill.deleted) {
        const updateQuery = `
          UPDATE skills
          SET skill = $/skill/
          WHERE skill_id = $/skillId/
          RETURNING *;
        `;
        return await t.one(updateQuery, skillObj);
      } else {
        throw new Error('403__skill already exists');
      }
  });
}

const deleteSkill = async (skillId) => {
  const deleteQuery = `
    UPDATE skills
    SET deleted = NOW()
    WHERE skill_id = $1
    RETURNING *;
  `;

  const promises = [];
  promises.push(db.one(deleteQuery, skillId));
  promises.push(volunteerSkillsQuery.deleteVolunteerSkillsBySkillId(skillId));
  const result = await Promise.all(promises);
  return result[0];
}


/* EXPORT */
module.exports = {
  selectAllSkills,
  insertSkill,
  updateSkill,
  deleteSkill
}
