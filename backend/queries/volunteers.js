/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

const userQueries = require('./users');
// const eventVolunteersQueries = require('./eventVolunteers');
// const mentorPairsQueries = require('./mentorPairs');
const volunteerSkillsQueries = require('./volunteerSkills');

const { formatStr } = require('../helpers/helpers');



/* QUERIES */

// Get all volunteers with filter cases
const getAllVolunteers = async (vEmail, company, skill, name, publicProfilesOnly, volunteerId) => {
  return await db.task(async (t) => {
    let parsedCompany = '';
    if (company) {
      parsedCompany = formatStr(company);
    }

    const selectQuery = `
      SELECT
        volunteers.v_id,
        volunteers.v_first_name,
        volunteers.v_last_name,
        v_slug,
        volunteers.v_picture,
        volunteers.v_email,
        volunteers.v_linkedin,
        volunteers.company,
        volunteers.title,
        volunteers.active,
        ARRAY_AGG(DISTINCT skills.skill) AS skills,
        JSONB_BUILD_OBJECT(
            'mentoring', volunteers.mentoring,
            'office_hours', volunteers.office_hours,
            'tech_mock_interview', volunteers.tech_mock_interview,
            'behavioral_mock_interview', volunteers.behavioral_mock_interview,
            'professional_skills_coach', volunteers.professional_skills_coach,
            'hosting_site_visit', volunteers.hosting_site_visit,
            'industry_speaker', volunteers.industry_speaker
          ) AS interests,
        ( SELECT CAST(event_id AS CHAR(10)) || ' &$%& ' || topic
            FROM  events
            INNER JOIN event_volunteers ON events.event_id = eventv_id
            WHERE event_volunteers.volunteer_id = v_id AND event_volunteers.confirmed = TRUE AND event_start > NOW()
            ORDER BY event_start ASC
            LIMIT 1
        ) AS next_event

      FROM volunteers
      INNER JOIN volunteer_skills ON volunteer_skills.volunteer_id = volunteers.v_id
      INNER JOIN skills ON volunteer_skills.skill_id = skills.skill_id
    `
    const endOfQuery = `
      GROUP BY volunteers.v_id
      ORDER BY v_last_name ASC
    `

    let condition = ' WHERE volunteers.confirmed = TRUE AND volunteers.deleted IS NULL ';

    if (vEmail) {
      condition += ' AND volunteers.v_email = $/vEmail/ '
    }
    if (parsedCompany) {
      condition += ` AND volunteers.parsed_company LIKE '%' || $/parsedCompany/ || '%' `
    }
    if (skill) {
      condition += ' AND LOWER(skills.skill) = $/skill/ '
    }
    if (name) {
      condition += ` AND LOWER(volunteers.v_first_name || ' ' || volunteers.v_last_name) LIKE '%' || $/name/ || '%' `
    }

    let volunteersList = null;
    if (publicProfilesOnly) {
      volunteersList = await t.any(selectQuery + condition + ' AND public_profile = TRUE ' + endOfQuery, {vEmail, parsedCompany, skill, name});
    } else {
      volunteersList = await t.any(selectQuery + condition + endOfQuery, {vEmail, parsedCompany, skill, name});
    }

    if (volunteerId) {
      const userProfile = await t.oneOrNone(selectQuery + condition + ` AND volunteers.v_id = $/volunteerId/ ` + endOfQuery, {vEmail, parsedCompany, skill, name, volunteerId})
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
      v_slug, 
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
const getSpecificVolunteer = async (id, email, slug) => {
  const selectQuery = `
    SELECT 
	    v_id, v_first_name, v_last_name, v_email, v_slug,
      volunteers.confirmed, volunteers.active,
      v_picture, company, title, v_bio, v_linkedin,
      mentoring, office_hours, tech_mock_interview,
      behavioral_mock_interview, professional_skills_coach,
      hosting_site_visit, industry_speaker,
      signup_date, inactive_date, volunteers.deleted, public_profile,
      ARRAY_AGG (DISTINCT skills.skill) AS skills,
      (SELECT
        ARRAY_AGG( CAST(event_id AS CHAR(10)) || ' &$%& ' || topic || ' &$%& ' || 
            event_start || ' &$%& ' || event_end || ' &$%& ' || CAST(volunteered_time AS CHAR(2)))
          FROM events 
          INNER JOIN event_volunteers ON event_id = eventv_id
          INNER JOIN volunteers ON volunteer_id = v_id
          WHERE (v_id = $/id/ OR v_email = $/email/ OR v_slug = $/slug/) AND event_volunteers.confirmed = TRUE AND event_end < NOW()
        ) AS past_events,
      (SELECT
        ARRAY_AGG( CAST(event_id AS CHAR(10)) || ' &$%& ' || topic || ' &$%& ' || event_start || ' &$%& ' || event_end )
          FROM events 
          INNER JOIN event_volunteers ON event_id = eventv_id
          INNER JOIN volunteers ON volunteer_id = v_id
          WHERE (v_id = $/id/ OR v_email = $/email/ OR v_slug = $/slug/) AND event_volunteers.confirmed = TRUE AND event_end >= NOW()
        ) AS future_events,
      (SELECT
        ARRAY_AGG (
          CAST(f_id AS CHAR(10)) || ' &$%& ' ||
          f_first_name || ' ' || f_last_name || ' &$%& ' ||
          CAST(starting_date AS CHAR(10)) || ' &$%& ' ||
          CASE WHEN mentor_pairs.deleted IS NULL THEN 'false' ELSE CAST(mentor_pairs.deleted AS CHAR(20)) END
        )
        FROM mentor_pairs INNER JOIN fellows ON mentee = f_id
        INNER JOIN volunteers ON mentor = v_id
        WHERE (v_id = $/id/ OR v_email = $/email/ OR v_slug = $/slug/)
      ) AS mentees,
      (SELECT
        SUM(volunteered_time)
        FROM event_volunteers
        INNER JOIN volunteers ON volunteer_id = v_id
        WHERE (v_id = $/id/ OR v_email = $/email/ OR v_slug = $/slug/) AND event_volunteers.confirmed = TRUE
      ) AS total_hours

    FROM volunteers
    INNER JOIN volunteer_skills ON v_id = volunteer_skills.volunteer_id
    INNER JOIN skills on volunteer_skills.skill_id = skills.skill_id
    INNER JOIN event_volunteers ON v_id = event_volunteers.volunteer_id
    INNER JOIN events ON eventv_id = event_id
    LEFT JOIN mentor_pairs ON v_id = mentor_pairs.mentor 
    WHERE (v_id = $/id/ OR v_email = $/email/ OR v_slug = $/slug/) 
    GROUP BY volunteers.v_id 
  `;

  const volunteer = await db.one(selectQuery, {id, email, slug});

  // if (publicProfilesOnly && !volunteer.public_profile && volunteer.v_id !== volunteerId){
  //   return new Error('403__Not accessible');
  // }
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
        v_slug,
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
        $/slug/,
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
      v_slug = $/slug/,
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

const updateViewType = async (userId, targetView) => {
  let updateQuery = ''

  if (targetView === 'events') {
      updateQuery = `
          UPDATE volunteers 
          SET e_grid = NOT e_grid
          WHERE a_id = $/userId/
          RETURNING e_grid
      `
  } else {
      updateQuery = `
          UPDATE volunteers 
          SET v_grid = NOT v_grid
          WHERE a_id = $/userId/
          RETURNING v_grid
      `
  }

  return await db.one(updateQuery, {userId});
}


/* EXPORT */
module.exports = {
  getAllVolunteers,
  getNewVolunteers,
  getVolunteerByEmail,
  getSpecificVolunteer,
  addVolunteer,
  updateVolunteer,
  confirmVolunteer,
  deleteVolunteer,
  deleteVolunteerByEmail,
  updateViewType
}

