/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */


// Get all events (past events are auto pushed to the back)
const getAllEvents = async () => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT classes.class) AS class,
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_first_name || ' ' || volunteers.v_last_name
        END
    ) AS volunteers

  FROM events

  INNER JOIN classes ON classes.class_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
                 
  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, classes.class     

  ORDER BY (
    CASE WHEN DATE(event_start) > now()
        THEN 1
        ELSE 0
        END
        ) 
  DESC, event_start ASC
  `;
  return await db.any(selectQuery);
}

const getSingleEvent = async (eId) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT classes.class) AS class,
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_first_name || ' ' || volunteers.v_last_name
        END
    ) AS volunteers

  FROM events

  INNER JOIN classes ON classes.class_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
       
  WHERE events.event_id = $/eId/

  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, classes.class     

  ORDER BY (
    CASE WHEN DATE(event_start) > now()
        THEN 1
        ELSE 0
        END
        ) 
  DESC, event_start ASC
  `;
  return await db.any(selectQuery, {eId});
}

const getAllEventsAdmin = async () => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT classes.class) AS class, 
    ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers

  FROM events

  INNER JOIN classes ON classes.class_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
                 
  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, classes.class
         
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
  events.instructor, events.number_of_volunteers AS volunteers_needed, ARRAY_AGG (DISTINCT classes.class) AS class, 
  ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers

  FROM events

  INNER JOIN classes ON classes.class_id = events.attendees
  INNER JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  INNER JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
    
  WHERE events.event_id = $/eId/

  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, classes.class
  `
  return await db.one(selectQuery, {eId});
}

// Get all upcoming events
const getUpcomingEvents = async () => {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start > now()
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
}

// Get all past events
const getPastEvents = async () => {
  const selectQuery = `
  SELECT * 
  FROM events 
  WHERE event_start < now()
  ORDER BY event_start ASC
  `;
  return await db.any(selectQuery);
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


/* EXPORT */
module.exports = {
  getAllEvents,
  getSingleEvent,
  getAllEventsAdmin,
  getSingleEventAdmin,
  getUpcomingEvents,
  getPastEvents,
  getPastEventsByVolunteerId
}
