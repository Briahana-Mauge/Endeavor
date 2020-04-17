/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

// const eventFollowsQueries = require('./eventFollows');
// const eventVolunteersQueries = require('./eventVolunteers');


/* HELPER FUNCTION */
const formatStr = str => {
  return str.toLowerCase()
}

/* QUERIES */


// Get all events (past events are auto pushed to the back)
const getAllEvents = async (vName, topic, instructor, upcoming, past) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS cohort,
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

  const endOfQuery = `
    GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
      events.instructor, events.number_of_volunteers, cohorts.cohort     
    ORDER BY event_start DESC
  `

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
    condition += `AND event_start > now() `
  }
  if (past) {
    condition += `AND event_start <= now() `
  }

  return await db.any(selectQuery + condition + endOfQuery, { vName, topic, instructor });
}

const getSingleEvent = async (eId) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS cohort,
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
       
  WHERE events.event_id = $/eId/ AND event.deleted IS NULL

  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort     

  ORDER BY event_start DESC
  `;
  return await db.any(selectQuery, { eId });
}

const getAllEventsAdmin = async (vName, topic, instructor, upcoming, past) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS cohort, 
    ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers
  
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id`

  const endOfQuery = `
  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
      events.instructor, events.number_of_volunteers, cohorts.cohort     
    ORDER BY event_start DESC
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
    condition += `AND event_start > now() `
  }
  if (past) {
    condition += `AND event_start <= now() `
  }

  return await db.any(selectQuery + condition + endOfQuery, { vName, topic, instructor });
}

//Get Single Event for Admin
const getSingleEventAdmin = async (eId) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
  events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT cohorts.cohort) AS cohort, 
  ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers
  
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
  
  WHERE events.event_id = $/eId/ AND events.deleted IS NULL

  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort
  `
  return await db.one(selectQuery, { eId });
}

// Get all upcoming events
const getUpcomingEvents = async () => {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start > now() AND deleted IS NULL
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
}

// Get all past events
const getPastEvents = async () => {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start < now() AND deleted IS NULL
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
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

// Get all past events by volunteer Id
const getPastEventsByVolunteerId = async (id) => {
  const selectQuery = `
    SELECT event_id, topic, event_start
    FROM events 
    INNER JOIN event_volunteers ON event_id = ev_id
    WHERE event_start < now() AND volunteer_id = $1 AND confirmed = TRUE
    ORDER BY event_start ASC
  `;
  return await db.any(selectQuery, id);
}

// Get all past events by volunteer Id
const getPastEventsByFellowId = async (id) => {
  const selectQuery = `
    SELECT event_id, topic, event_start
    FROM events 
    INNER JOIN event_fellows ON event_id = ef_id
    WHERE event_start < now() AND fellow_id = $1
    ORDER BY event_start ASC
  `;
  return await db.any(selectQuery, id);
}


/* EXPORT */
module.exports = {
  getAllEvents,
  getSingleEvent,
  getAllEventsAdmin,
  getSingleEventAdmin,
  getUpcomingEvents,
  getPastEvents,
  getPastEventsByVolunteerId,
  getPastEventsByFellowId,
  deleteEvent
}
