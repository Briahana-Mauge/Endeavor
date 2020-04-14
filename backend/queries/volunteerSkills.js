/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */

// Get all skills by volunteer id
const getVolunteerSkills = async (id) => {
    const selectQuery = `
    SELECT ARRAY_AGG (skill_id) AS skills_list
    FROM volunteer_skills
    WHERE volunteer_id = $1 AND deleted IS NULL
    GROUP BY volunteer_id
  `;
    return await db.oneOrNone(selectQuery, id);
}

// delete skills by volunteer id
const deleteVolunteerSkillsByVolunteerId = async (id, promise) => {
  const deleteQuery = `
    UPDATE volunteer_skills
    SET deleted = NOW()
    WHERE volunteer_id = $1
    RETURNING *
`;
  if (promise) {
    return db.any(deleteQuery, id);
  }
  return await db.any(deleteQuery, id);
}

// delete skills by skill id
const deleteVolunteerSkillsBySkillId = async (id, promise) => {
  const deleteQuery = `
    UPDATE volunteer_skills
    SET deleted = NOW()
    WHERE skill_id = $1
    RETURNING *
`;
  if (promise) {
    return db.any(deleteQuery, id);
  }
  return await db.any(deleteQuery, id);
}

module.exports = {
    getVolunteerSkills,
    deleteVolunteerSkillsByVolunteerId,
    deleteVolunteerSkillsBySkillId
}