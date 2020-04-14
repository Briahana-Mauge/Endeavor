/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* HELPER FUNCTION */
const formatStr = str => {
  return str.toLowerCase()
}

/* QUERIES */


// Get all events (past events are auto pushed to the back)
const getAllEvents = async (vName, topic, instructor, upcoming, past) => {


  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS class,
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_first_name || ' ' || volunteers.v_last_name
        END
    ) AS volunteers
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
  `

  let endOfQuery = `GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort     
  ORDER BY (
    CASE WHEN DATE(event_start) > now()
        THEN 1
        ELSE 0
        END
        ) 
  DESC, event_start ASC
  `
  if (lowercasevName === '' && lowercaseTopic === '' && lowercaseInstructor === '' && upcoming === '' && past === '') {
    return await db.any(selectQuery + endOfQuery);
  }
  else if (lowercaseTopic === '' && lowercaseInstructor === '' && upcoming === '' && past === '') {
    return await db.any(`${selectQuery} WHERE lower(volunteers.v_first_name) = $/lowercasevName/ OR lower(volunteers.v_last_name) = $/lowercasevName/ OR lower(volunteers.v_first_name || ' ' || volunteers.v_last_name) = $/lowercasevName/
     ${endOfQuery}`, { lowercasevName });
  }
  else if (lowercasevName === '' && lowercaseInstructor === '' && upcoming === '' && past === '') {
    return await db.any(`${selectQuery} WHERE LOWER (events.topic) LIKE '%' || $/lowercaseTopic/ || '%' ${endOfQuery}`, { lowercaseTopic });
  }
  else if (lowercasevName === '' && lowercaseTopic === '' && upcoming === '' && past === '') {
    return await db.any(`${selectQuery} WHERE LOWER (events.instructor) LIKE '%' || $/lowercaseInstructor/ || '%' ${endOfQuery}`, { lowercaseInstructor });
  }
  else if (lowercasevName === '' && lowercaseTopic === '' && lowercaseInstructor === '' && past === '') {
    return await getUpcomingEvents();
  } else {
    return await getPastEvents();
  }


}

const getSingleEvent = async (eId) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS class,
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_first_name || ' ' || volunteers.v_last_name
        END
    ) AS volunteers
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
       
  WHERE events.event_id = $/eId/
  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort     
  ORDER BY (
    CASE WHEN DATE(event_start) > now()
        THEN 1
        ELSE 0
        END
        ) 
  DESC, event_start ASC
  `;
  return await db.any(selectQuery, { eId });
}

const getAllEventsAdmin = async () => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS class, 
    ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
                 
  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort
         
  ORDER BY (CASE WHEN DATE(event_start) > now()
    THEN 1
    ELSE 0
    END
    ) 
  DESC, event_start ASC
  `;
  return await db.any(selectQuery);
}

//Get Single Event for Admin
const getSingleEventAdmin = async (eId) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
  events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS class, 
  ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
    
  WHERE events.event_id = $/eId/
  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort
  `
  return await db.one(selectQuery, { eId });
}

// Get all upcoming events
async function getUpcomingEvents() {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start > now()
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
}

// Get all past events
async function getPastEvents() {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start < now()
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
}


/* EXPORT */
module.exports = {
  getAllEvents,
  getSingleEvent,
  getAllEventsAdmin,
  getSingleEventAdmin,
  getUpcomingEvents,
  getPastEvents
}