/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

/* QUERIES */

// Get all events (past events are auto pushed to the back)
const getAllEvents = async (volunteerId, vName, topic, instructor, upcoming, past) => {
  const selectQuery = `
  SELECT
    event_id, 
    topic, 
    event_start, 
    event_end, 
    description, 
    location, 
    instructor, 
    cohort,
    cohort_id,
    materials_url,
    JSON_AGG(
    	CASE 
    		WHEN v_id = $/volunteerId/ THEN 
    		JSON_BUILD_OBJECT (
      		'volunteerId', v_id,
      		'name', v_first_name || ' ' || v_last_name,
      		'email', v_email,
      		'deletedProfile', volunteers.deleted,
      		'confirmedToEvent', event_volunteers.confirmed,
      		'volunteeredTime', volunteered_time
      	)
    	END	
    ) AS volunteers_list
    
  FROM events
  INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
  LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
  LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
  `

  const endOfQuery = `
    GROUP BY
      event_id,
      cohort_id
    ORDER BY event_start ASC
  `;

  let condition = ' WHERE events.deleted IS NULL ';

  if (vName) {
    condition += `AND lower(volunteers.v_first_name) = $/vName/ OR lower(volunteers.v_last_name) = $/vName/ OR lower(volunteers.v_first_name || ' ' || volunteers.v_last_name) = $/vName/ `
  }

  if (topic) {
    condition += `AND lower(events.topic) LIKE '%' || $/topic/ || '%' `
  }

  if (instructor) {
    condition += `AND lower(events.instructor) LIKE '%' || $/instructor/ || '%' `
  }

  if (upcoming) {
    condition += `AND event_end >= now() `
  }
  if (past) {
    condition += `AND event_end < now() `
  }

  return await db.any(selectQuery + condition + endOfQuery, { volunteerId, vName, topic, instructor });
}

const getSingleEvent = async (eventId, volunteerId) => {
  const selectQuery = `
    SELECT
      event_id, 
      topic, 
      event_start, 
      event_end, 
      description, 
      location, 
      instructor, 
      cohort,
      cohort_id,
      materials_url,
      JSON_AGG(
        CASE 
          WHEN v_id = $/volunteerId/ THEN 
          JSON_BUILD_OBJECT (
            'volunteerId', v_id,
            'name', v_first_name || ' ' || v_last_name,
            'email', v_email,
            'deletedProfile', volunteers.deleted,
            'confirmedToEvent', event_volunteers.confirmed,
            'volunteeredTime', volunteered_time
          )
        END	
      ) AS volunteers_list
      
    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
    LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
    LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id

    WHERE events.event_id = $/eventId/ AND events.deleted IS NULL

    GROUP BY  
      events.event_id, 
      events.topic, 
      events.event_start, 
      events.event_end, 
      events.description, 
      events.location, 
      events.instructor, 
      events.number_of_volunteers, 
      cohorts.cohort,
      cohorts.cohort_id,
      important
  `

  return await db.one(selectQuery, { eventId, volunteerId });
}

const getAllEventsAdmin = async (vName, topic, instructor, upcoming, past) => {
  const selectQuery = `
  SELECT
    event_id, 
    topic, 
    event_start, 
    event_end, 
    description, 
    staff_description,
    location, 
    instructor, 
    number_of_volunteers, 
    cohort,
    cohort_id,
    materials_url,
    JSON_AGG(
    	JSON_BUILD_OBJECT (
      	'volunteerId', v_id,
      	'name', v_first_name || ' ' || v_last_name,
      	'email', v_email,
      	'deletedProfile', volunteers.deleted,
      	'confirmedToEvent', event_volunteers.confirmed,
      	'volunteeredTime', volunteered_time
      )
    ) AS volunteers_list
    
  FROM events
  INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
  LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
  LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
  `

  const endOfQuery = `
    GROUP BY
      event_id,
      cohort_id
    ORDER BY event_start ASC
  `;

  let condition = ' WHERE events.deleted IS NULL ';

  if (vName) {
    condition += `AND lower(volunteers.v_first_name) = $/vName/ OR lower(volunteers.v_last_name) = $/vName/ OR lower(volunteers.v_first_name || ' ' || volunteers.v_last_name) = $/vName/ `
  }

  if (topic) {
    condition += `AND lower(events.topic) LIKE '%' || $/topic/ || '%' `
  }

  if (instructor) {
    condition += `AND lower(events.instructor) LIKE '%' || $/instructor/ || '%' `
  }

  if (upcoming) {
    condition += `AND event_end >= now() `
  }
  if (past) {
    condition += `AND event_end < now() `
  }

  return await db.any(selectQuery + condition + endOfQuery, { vName, topic, instructor });
}

//Get Single Event for Admin
const getSingleEventAdmin = async (eventId) => {
  const selectQuery = `
    SELECT
      event_id, 
      topic, 
      event_start, 
      event_end, 
      description, 
      staff_description,
      location, 
      instructor, 
      number_of_volunteers, 
      cohort,
      cohort_id,
      materials_url,
      important,
      JSON_AGG(
        JSON_BUILD_OBJECT (
          'volunteerId', v_id,
          'name', v_first_name || ' ' || v_last_name,
          'email', v_email,
          'deletedProfile', volunteers.deleted,
          'confirmedToEvent', event_volunteers.confirmed,
          'volunteeredTime', volunteered_time
        )
      ) AS volunteers_list
      
    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
    LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
    LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id

    WHERE events.event_id = $/eventId/ AND events.deleted IS NULL

    GROUP BY  
      events.event_id, 
      events.topic, 
      events.event_start, 
      events.event_end, 
      events.description, 
      events.location, 
      events.instructor, 
      events.number_of_volunteers, 
      cohorts.cohort,
      cohorts.cohort_id,
      important
  `

  return await db.one(selectQuery, { eventId });
}

// Get all events data for admin dashboards
const getDashEventsForAdmin = async () => {
  const queryPrefix = `
    SELECT
        event_id,
        topic,
        event_start,
        event_end,
        description,
        staff_description,
        attendees,
        location,
        instructor,
        number_of_volunteers,
        cohort,
        cohort_id,
        materials_url,
        important

    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
    LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
    LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
    WHERE events.deleted IS NULL
  `;
  const queryEnd = `
    GROUP BY
        event_id,
        cohort_id
    ORDER BY event_start ASC
  `;

  const todaysQuery = `
    ${queryPrefix}
    AND event_end::DATE >= now()::DATE AND event_start::DATE <= now()::DATE
    ${queryEnd};
  `;
  // const importantsQuery = `
  //   ${queryPrefix}
  //   AND event_start::DATE > now()::DATE AND important = TRUE
  //   ${queryEnd}
  //   LIMIT 5;
  // `;
  const upcomingsQuery = `
    ${queryPrefix}
    AND event_end::DATE >= now()::DATE AND event_start::DATE <= (now() + interval '2 weeks')::DATE
    ${queryEnd};
  `;
  const pastYearHours = `
    SELECT
        TO_CHAR(event_end, 'MM-YYYY') AS date,  
        SUM(event_volunteers.volunteered_time) AS hours
    FROM event_volunteers
    INNER JOIN events ON event_volunteers.eventv_id = events.event_id
    WHERE event_end > (CURRENT_DATE - INTERVAL '12 months') 
        AND event_end < CURRENT_DATE
        AND event_volunteers.deleted IS NULL
        AND events.deleted IS NULL
    GROUP BY DATE
    ORDER BY DATE ASC;
  `;
  const pastYearEventAmount = `
    SELECT
        TO_CHAR(event_end, 'MM-YYYY') AS date,  
        COUNT(events.event_id)
    FROM events
    WHERE event_end > (CURRENT_DATE - INTERVAL '12 months') 
        AND event_end < CURRENT_DATE
        AND events.deleted IS NULL
    GROUP BY DATE
    ORDER BY DATE ASC;
  `;
  const pastYearVolunteerSignups = `
    SELECT
        TO_CHAR(signup_date, 'MM-YYYY') AS date,  
        COUNT(volunteers.signup_date) AS volunteers
    FROM volunteers
    WHERE signup_date > (CURRENT_DATE - INTERVAL '12 months') 
        AND signup_date <= CURRENT_DATE
    GROUP BY DATE
    ORDER BY DATE ASC;
  `;
  return db.multi( todaysQuery + upcomingsQuery + pastYearHours + pastYearEventAmount + pastYearVolunteerSignups )
    .then(([todays, upcomings, hours, events, volunteers]) => {
        return { todays, upcomings, hours, events, volunteers };
    });
}

// Get all events data for volunteer dashboards
const getDashEventsForVolunteer = async (volunteerId) => {
  const selectColumns = `
        event_id, 
        topic, 
        event_start, 
        event_end, 
        description, 
        staff_description,
        location, 
        instructor, 
        number_of_volunteers, 
        cohort,
        cohort_id,
        materials_url
  `;
  const importantsQuery = `
    SELECT
        ${selectColumns}

    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id

    WHERE event_start > now()
        AND event_start::DATE <= (now() + interval '1 week')::DATE
        AND events.deleted IS NULL
    GROUP BY event_id, cohort_id
    ORDER BY event_start ASC;
  `;
  const upcomingsQuery = `
    SELECT
        ${selectColumns}

    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
    LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
    LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id

    WHERE event_start > now()
        AND volunteer_id = $1
        AND event_volunteers.confirmed = TRUE
        AND events.deleted IS NULL
    GROUP BY event_id, cohort_id
    ORDER BY event_start ASC;
  `;
  const pastsQuery = `
    SELECT
        ${selectColumns}

    FROM volunteers
    INNER JOIN event_volunteers ON event_volunteers.volunteer_id = volunteers.v_id
    INNER JOIN events ON event_volunteers.eventv_id = events.event_id
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id

    WHERE event_end < now()
        AND volunteers.v_id = $1
        AND event_volunteers.confirmed = TRUE
    GROUP BY volunteers.v_id, event_id, cohort_id
    ORDER BY event_start ASC
    LIMIT 3;
  `;

  const pastYearData = `
    SELECT
        TO_CHAR(event_end, 'MM-YYYY') AS date, 
	      COUNT(EXTRACT(MONTH FROM event_end)) AS events_count,
	      SUM(event_volunteers.volunteered_time) AS hours
        
	    FROM volunteers
	    INNER JOIN event_volunteers ON volunteer_id = v_id
	    INNER JOIN events ON eventv_id = event_id
	    WHERE event_end > (current_date - INTERVAL '12 months') 
        AND event_end <= CURRENT_DATE 
        AND volunteers.v_id = $1 
	    	AND event_volunteers.confirmed = TRUE
	    GROUP BY date
	    ORDER BY date ASC
  `
  return db.multi(importantsQuery + upcomingsQuery + pastsQuery + pastYearData, volunteerId)
    .then(([importants, upcomings, pasts, pastData]) => {
      return { importants, upcomings, pasts, pastData };
    });
}

// Add new event
const postEvent = async (eventObj) => {
  const insertQuery = `
    INSERT INTO events (
      event_start,
      event_end,
      topic,
      description,
      staff_description,
      attendees,
      location,
      instructor,
      number_of_volunteers,
      materials_url,
      important
    ) VALUES (
      $/start/,
      $/end/,
      $/topic/,
      $/description/,
      $/staffDescription/,
      $/attendees/,
      $/location/,
      $/instructor/,
      $/numberOfVolunteers/,
      $/materialsUrl/,
      $/important/
    )
    RETURNING *
  `
  return await db.one(insertQuery, eventObj);
}

// Edit event
const editEvent = async (eventObj) => {
  const updateQuery = `
    UPDATE events SET
      event_start = $/start/,
      event_end = $/end/,
      topic = $/topic/,
      description = $/description/,
      staff_description = $/staffDescription/,
      attendees = $/attendees/,
      location = $/location/,
      instructor = $/instructor/,
      number_of_volunteers = $/numberOfVolunteers/,
      materials_url = $/materialsUrl/,
      important = $/important/
    WHERE event_id = $/eventId/
    RETURNING *
  `
  return await db.one(updateQuery, eventObj);
}

// delete events
const deleteEvent = async (id) => {
  const deleteQuery = `
  UPDATE events
  SET deleted = NOW()
  WHERE event_id = $1
  RETURNING *
  `;

  const promises = [];
  promises.push(db.one(deleteQuery, id));
  // promises.push(eventVolunteersQueries.delete...(id, true));
  // promises.push(eventFollowsQueries.delete...(fId, true));

  const response = await Promise.all(promises);
  return response[0];
}

/* EXPORT */
module.exports = {
  getAllEvents,
  getSingleEvent,
  getAllEventsAdmin,
  getSingleEventAdmin,
  getDashEventsForAdmin,
  getDashEventsForVolunteer,
  postEvent,
  editEvent,
  deleteEvent
}
