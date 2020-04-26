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
const getAllVolunteers = async (vEmail, company, skill, name, publicProfilesOnly, volunteerId) => {
  return await db.task(async (t) => {
    let parsedCompany = '';
    let parsedSkill = '';

    if (company) {
      parsedCompany = formatStr(company);
    }
    if (skill) {
      parsedSkill = formatStr(skill);
    }

    const selectQuery = `
      SELECT volunteers.v_id, volunteers.v_first_name, volunteers.v_last_name, 
          volunteers.v_picture, volunteers.v_email, volunteers.company, volunteers.title, 
          ARRAY_AGG(DISTINCT skills.skill) AS skills,  
          ARRAY_AGG(DISTINCT event_volunteers.eventv_id) AS topic_ids,
          volunteers.active
      FROM volunteers 
      INNER JOIN volunteer_skills ON volunteer_skills.volunteer_id = volunteers.v_id
      INNER JOIN skills ON volunteer_skills.skill_id = skills.skill_id
      INNER JOIN event_volunteers ON event_volunteers.volunteer_id = volunteers.v_id
    `
    const endOfQuery = `
      GROUP BY volunteers.v_id
      ORDER BY v_first_name ASC
    `

    let condition = ' WHERE volunteers.confirmed = TRUE AND volunteers.deleted IS NULL ';

    if (vEmail) {
      condition += ' AND volunteers.v_email = $/vEmail/ '
    }
    if (parsedCompany) {
      condition += ' AND volunteers.parsed_company = $/parsedCompany/ '
    }
    if (parsedSkill) {
      condition += ' AND skills.parsed_skill = $/parsedSkill/ '
    }
    if (name) {
      condition += ` AND LOWER(volunteers.v_first_name) = $/name/ OR LOWER(volunteers.v_last_name) = $/name/ OR LOWER(volunteers.v_first_name || ' ' || volunteers.v_last_name) = $/name/ `
    }

    let volunteersList = null;
    if (publicProfilesOnly) {
      volunteersList = await t.any(selectQuery + condition + ' AND public_profile = TRUE ' + endOfQuery, {vEmail, parsedCompany, parsedSkill, name});
    } else {
      volunteersList = await t.any(selectQuery + condition + endOfQuery, {vEmail, parsedCompany, parsedSkill, name});
    }

    if (volunteerId) {
      const userProfile = await t.oneOrNone(selectQuery + condition + ` AND volunteers.v_id = $/volunteerId/ ` + endOfQuery, {vEmail, parsedCompany, parsedSkill, name, volunteerId})
      if (userProfile && !userProfile.public_profile && Array.isArray(volunteersList)) {
        volunteersList.push(userProfile);
      }
    }

    return volunteersList;
  })
}


// Get all new (unconfirmed) volunteers
const getNewVolunteers = async () => {
  const selectQuery = `
    SELECT 
      v_id, 
      v_first_name, 
      v_last_name, 
      v_picture, 
      v_email, 
      company, 
      title, 
      ARRAY_AGG(DISTINCT skills.skill) AS skills  
    FROM volunteers 
    INNER JOIN volunteer_skills ON volunteer_skills.volunteer_id = volunteers.v_id
    INNER JOIN skills ON volunteer_skills.skill_id = skills.skill_id
    WHERE confirmed = FALSE
    GROUP BY v_id
    ORDER BY signup_date ASC
  `;
  return await db.any(selectQuery);
}

// Get volunteer by email (FOR AUTH purpose)
const getVolunteerByEmail = async (vEmail) => {
  const selectQuery = `
  SELECT *
  FROM volunteers
  WHERE v_email = $/vEmail/
  `;
  return await db.one(selectQuery, { vEmail });
}

// Get volunteer by Id Or email
const getVolunteerByIdOrEmail = async (id, email, publicProfilesOnly, volunteerId) => {
  const selectQuery = `
    SELECT 
	    v_id, v_first_name, v_last_name, v_email,
      volunteers.confirmed, volunteers.active,
      v_picture, company, title, v_bio, v_linkedin,
      mentoring, office_hours, tech_mock_interview,
      behavioral_mock_interview, professional_skills_coach,
      hosting_site_visit, industry_speaker,
      signup_date, inactive_date, volunteers.deleted, public_profile,
      ARRAY_AGG (DISTINCT skills.skill) AS skills,
      ARRAY_AGG (DISTINCT events.event_id) AS event_ids,
      ARRAY_AGG (DISTINCT mentor_pairs.mentee) AS mentee_ids
    FROM volunteers
    INNER JOIN volunteer_skills ON v_id = volunteer_skills.volunteer_id
    INNER JOIN skills on volunteer_skills.skill_id = skills.skill_id
    INNER JOIN event_volunteers ON v_id = event_volunteers.volunteer_id
    INNER JOIN events ON eventv_id = event_id
    LEFT JOIN mentor_pairs ON v_id = mentor_pairs.mentor 
  `;

  let condition = '';
  const endOfQuery = ` GROUP BY volunteers.v_id `
  
  if (id) {
    condition = ' WHERE v_id = $/id/ '
  } else if (email) {
    condition = ' WHERE v_email = $/email/ '
  }

  const volunteer = await db.one(selectQuery + condition + endOfQuery, {id, email});

  if (publicProfilesOnly && !volunteer.public_profile && volunteer.v_id !== volunteerId){
    return new Error('403__Not accessible');
  }
  return volunteer;
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
        industry_speaker,
        public_profile
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
        $/industrySpeaker/,
        $/publicProfile/
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
      industry_speaker = $/industrySpeaker/,
      public_profile = $/publicProfile/
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
  if (promise) {
    return deleteVolunteer(volunteer.v_id);
  }
  return await deleteVolunteer(volunteer.v_id);
}

const confirmVolunteer = async (id) => {
  const confirmQuery = `
    UPDATE volunteers
    SET confirmed = TRUE
    WHERE v_id = $/id/
    RETURNING *
  `
  return await db.one(confirmQuery, {id});
}

/* EXPORT */
module.exports = {
  getAllVolunteers,
  getNewVolunteers,
  getVolunteerByEmail,
  getVolunteerByIdOrEmail,
  addVolunteer,
  updateVolunteer,
  confirmVolunteer,
  deleteVolunteer,
  deleteVolunteerByEmail
}

