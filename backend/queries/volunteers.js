/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

const userQueries = require('./users');


/* QUERIES */

// Get all volunteers
const getAllVolunteers = async () => {
  const selectQuery = `
    SELECT volunteers.v_id, volunteers.v_first_name, volunteers.v_last_name, 
        volunteers.v_picture, volunteers.v_email, volunteers.company, volunteers.title, 
        ARRAY_AGG(DISTINCT skills.skill) AS skills,  ARRAY_AGG(DISTINCT events.topic) AS topics,
        volunteers.active
    FROM volunteers 
    INNER JOIN volunteer_skills ON volunteer_skills.volunteer_id = volunteers.v_id
    INNER JOIN skills ON volunteer_skills.skill_id = skills.skill_id
    INNER JOIN event_volunteers ON event_volunteers.volunteer_id = volunteers.v_id
    INNER JOIN events ON events.event_id = event_volunteers.eventv_id
    GROUP BY volunteers.v_id
    ORDER BY v_first_name ASC;
  `;
  return await db.any(selectQuery);
}

// Get all new (unconfirmed) volunteers
const getNewVolunteers = async () => {
  const selectQuery = `
      SELECT *
      FROM volunteers
      WHERE confirmed = FALSE
      ORDER BY v_first_name ASC
    `;
  return await db.any(selectQuery);
}

// Get volunteer by email 
const getVolunteerByEmail = async (vEmail) => {
  const selectQuery = `
  SELECT *
  FROM volunteers
  WHERE v_email = $/vEmail/
  `;
  return await db.one(selectQuery, { vEmail });
}

// Get all volunteers by some filter
// const getVolunteer



const formatStr = str => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const addVolunteer = async (user, password) => {
  const registeredUser = await userQueries.addUser(user.email, password, 'volunteer');

  user.formattedCompanyName = formatStr(user.company);
  const insertQuery = `
    INSERT INTO volunteers 
      (
        v_first_name, 
        v_last_name, 
        v_email,
        company, 
        parsed_company, 
        title, 
        mentoring, 
        office_hours, 
        tech_mock_interview, 
        behavioral_mock_interview, 
        professional_skills_coach, 
        hosting_site_visit, 
        industry_speaker
      )
      VALUES (
        $/firstName/,
        $/lastName/, 
        $/email/, 
        $/company/, 
        $/formattedCompanyName/, 
        $/title/, 
        $/mentor/, 
        $/officeHours/, 
        $/techMockInterview/, 
        $/behavioralMockInterview/, 
        $/professionalSkillsCoach/, 
        $/hostSiteVisit/, 
        $/industrySpeaker/
      )
      RETURNING *
  `;

  try {
    return await db.one(insertQuery, user)
  } catch (err) {
    if (registeredUser) {
      userQueries.deleteUser(user.email);
    }
    throw err;
  }
}

const updateVolunteer = async (user) => {
  user.formattedCompanyName = formatStr(user.company);
  const updateQuery = `
    UPDATE volunteers
    SET 
      v_first_name = $/firstName/,
      v_last_name = $/lastName/,
      v_picture = $/picture/,
      company = $/company/,
      parsed_company = $/formattedCompanyName/,
      title = $/title/,
      v_bio = $/bio/,
      v_linkedin = $/linkedIn/,
      mentoring = $/mentor/,
      office_hours = $/officeHours/,
      tech_mock_interview = $/techMockInterview/,
      behavioral_mock_interview = $/behavioralMockInterview/,
      professional_skills_coach = $/professionalSkillsCoach/,
      hosting_site_visit = $/hostSiteVisit/,
      industry_speaker = $/industrySpeaker/
    WHERE v_id = $/userId/
    RETURNING *
  `;
  return await db.one(updateQuery, user);
}

const deleteVolunteer = async (id) => {
  return await db.one('DELETE FROM volunteers WHERE v_id = $/id/ RETURNING *', { id });
}

/* EXPORT */
module.exports = {
  getAllVolunteers,
  getNewVolunteers,
  getVolunteerByEmail,
  addVolunteer,
  updateVolunteer,
  deleteVolunteer
}

