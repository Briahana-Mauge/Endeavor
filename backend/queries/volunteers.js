/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

const userQueries = require('./users');
const timeQueries = require('./time');
// const eventVolunteersQueries = require('./eventVolunteers');
// const mentorPairsQueries = require('./mentorPairs');
const volunteerSkillsQueries = require('./volunteerSkills');


/* QUERIES */

// Get all volunteers
const getAllVolunteers = async () => {
    const selectQuery = `
    SELECT *
    FROM volunteers
    ORDER BY v_first_name ASC
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
  return await db.one(selectQuery, {vEmail});
}

// Get all volunteers by some filter




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
    const volunteer = await db.one(insertQuery, user);

    const promises = [];
    user.skills.forEach(skillId => promises.push(db.none('INSERT INTO volunteer_skills (volunteer_id, skill_id) VALUES ($1, $2)', [volunteer.v_id, skillId])));
    await Promise.all(promises);

    return volunteer;
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

  const volunteer = await db.one(updateQuery, user);

  await db.none('DELETE FROM volunteer_skills WHERE volunteer_id = $1', user.userId);

  const promises = [];
  user.skills.forEach(skillId => promises.push(db.none('INSERT INTO volunteer_skills (volunteer_id, skill_id) VALUES ($1, $2)', [user.userId, skillId])));
  await Promise.all(promises);

  return volunteer;
}

const deleteVolunteer = async (id) => {
  const deleteQuery = `
    UPDATE volunteers
    SET deleted = NOW()
    WHERE v_id = $1
    RETURNING *
  `
  const promises = [];
  promises.push(db.one(deleteQuery, id));
  promises.push(timeQueries.deleteHoursByVolunteerId(id, true));
  // promises.push(eventVolunteersQueries.delete...(id, true));
  // promises.push(mentorPairsQueries.delete...(id, true));
  promises.push(volunteerSkillsQueries.deleteVolunteerSkillsByVolunteerId(id, true));
  
  const result = await Promise.all(promises);
  return await result[0];
}

const deleteVolunteerByEmail = async (email, promise) => {
  const volunteer = await db.one('SELECT * FROM volunteers WHERE v_email = $1', email);
  console.log(volunteer)
  if (promise) {
    return deleteVolunteer(volunteer.v_id);
  }
  return await deleteVolunteer(volunteer.v_id);
}

/* EXPORT */
module.exports = {
    getAllVolunteers,
    getNewVolunteers,
    getVolunteerByEmail,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    deleteVolunteerByEmail
}

