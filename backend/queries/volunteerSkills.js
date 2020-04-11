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
    WHERE volunteer_id = $1
    GROUP BY volunteer_id
  `;
    return await db.oneOrNone(selectQuery, id);
}

module.exports = {
    getVolunteerSkills
}