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

const { formatStr } = require('../helpers/helpers');



/* QUERIES */

// Get all volunteers with filter cases
const getAllVolunteers = async (vEmail, company, skill, name) => {
  let parsedCompany = '';
  let parsedSkill = '';
  let lowercaseName = ''
  if (company) {
    parsedCompany = formatStr(company);
    console.log(parsedCompany)
  }
  if (skill) {
    parsedSkill = formatStr(skill);
  }
  if (name) {
    lowercaseName = name.toLowerCase();
  }

  const selectQuery = `
    SELECT volunteers.v_id, volunteers.v_first_name, volunteers.v_last_name, 
        volunteers.v_picture, volunteers.v_email, volunteers.company, volunteers.title, 
        ARRAY_AGG(DISTINCT skills.skill) AS skills,  
        ARRAY_AGG(DISTINCT events.topic) AS topics,
        volunteers.active
    FROM volunteers 
    INNER JOIN volunteer_skills ON volunteer_skills.volunteer_id = volunteers.v_id
    INNER JOIN skills ON volunteer_skills.skill_id = skills.skill_id
    INNER JOIN event_volunteers ON event_volunteers.volunteer_id = volunteers.v_id
    INNER JOIN events ON events.event_id = event_volunteers.eventv_id
    
  `
  const endOfQuery = `
    GROUP BY volunteers.v_id
    ORDER BY v_first_name ASC
  `
  if (vEmail === '' && parsedCompany === '' && parsedSkill === '' && lowercaseName === '') { //use name instead of email
    return await db.any(selectQuery + endOfQuery);

  }
  else if (parsedCompany === '' && parsedSkill === '' && lowercaseName === '') {
    return await db.any(`${selectQuery} WHERE volunteers.v_email = $/vEmail/ ${endOfQuery}`, { vEmail });
  }
  else if (vEmail === '' && parsedSkill === '' && lowercaseName === '') {
    return await db.any(`${selectQuery} WHERE volunteers.parsed_company = $/parsedCompany/ ${endOfQuery}`, { parsedCompany });
  } else if (vEmail === '' && parsedCompany === '' && lowercaseName === '') {
    return await db.any(`${selectQuery} WHERE skills.parsed_skill = $/parsedSkill/ ${endOfQuery}`, { parsedSkill });
  }
  else {
    return await db.any(`${selectQuery} WHERE lower(volunteers.v_first_name) = $/lowercaseName/ OR lower(volunteers.v_last_name) = $/lowercaseName/ OR LOWER(volunteers.v_first_name || ' ' || volunteers.v_last_name) = $/lowercaseName/
  ${endOfQuery}`, { lowercaseName });

  }
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

// Get volunteer by Id 
const getVolunteerById = async (id) => {
  const selectQuery = `
    SELECT 
	    v_id, v_first_name, v_last_name, v_email,
      volunteers.confirmed, volunteers.active,
      v_picture, company, title, v_bio, v_linkedin,
      mentoring, office_hours, tech_mock_interview,
      behavioral_mock_interview, professional_skills_coach,
      hosting_site_visit, industry_speaker,
      signup_date, inactive_date, volunteers.deleted,
      banked_time, planned_time, 
      ARRAY_AGG (DISTINCT skills.skill) AS skills,
      ARRAY_AGG (DISTINCT events.event_id) AS event_ids,
      ARRAY_AGG (DISTINCT mentor_pairs.mentee) AS mentee_ids
    FROM volunteers
    INNER JOIN volunteer_skills ON v_id = volunteer_skills.volunteer_id
    INNER JOIN skills on volunteer_skills.skill_id = skills.skill_id
    INNER JOIN event_volunteers ON v_id = event_volunteers.volunteer_id
    INNER JOIN events ON eventv_id = event_id
    INNER JOIN volunteers_hours ON v_id = volunteers_hours.volunteer_id
    LEFT JOIN mentor_pairs ON v_id = mentor_pairs.mentor
    WHERE v_id = $1
    GROUP BY volunteers.v_id, volunteers_hours.banked_time, volunteers_hours.planned_time
  `;
  return await db.one(selectQuery, id);
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
  getVolunteerById,
  addVolunteer,
  updateVolunteer,
  deleteVolunteer,
  deleteVolunteerByEmail
}

