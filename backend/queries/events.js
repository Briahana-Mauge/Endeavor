/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

// const eventFollowsQueries = require('./eventFollows');
// const eventVolunteersQueries = require('./eventVolunteers');


/* QUERIES */

// Get all events (past events are auto pushed to the back)
const getAllEvents = async (vName, topic, instructor, upcoming, past) => {
  const selectQuery = `
  SELECT
    events.event_id,
    events.topic,
    events.event_start,
    events.event_end,
    events.description,
    events.location,
    events.instructor,
    events.number_of_volunteers AS volunteers_needed,
    cohorts.cohort,
    cohorts.cohort_id,
    materials_url,
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_first_name || ' ' || volunteers.v_last_name
        END
    ) AS volunteers, 
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_email
        END
    ) AS v_email
    
    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
    LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
    LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
`

  const endOfQuery = `
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
    ORDER BY (
      CASE 
        WHEN event_start > NOW()
        THEN 1
        ELSE 0
      END
    ) DESC, event_start ASC
  `

  let condition = ' WHERE events.deleted IS NULL ';

  if (vName) {
    condition += `AND lower(volunteers.v_first_name || ' ' || volunteers.v_last_name) LIKE '%' || $/vName/ || '%' `
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
    events.instructor, events.number_of_volunteers AS volunteers_needed, cohorts.cohort, cohorts.cohort_id, materials_url, important,
    ARRAY_AGG ( 
      DISTINCT
      CASE 
        WHEN event_volunteers.confirmed = TRUE 
        THEN volunteers.v_first_name || ' ' || volunteers.v_last_name
        END
    ) AS volunteers
    
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  LEFT JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  LEFT JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id

  WHERE events.event_id = $/eId/ AND events.deleted IS NULL

  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort, cohorts.cohort_id    

  ORDER BY event_start DESC
  `;
  return await db.one(selectQuery, { eId });
}

const getAllEventsAdmin = async (vName, topic, instructor, upcoming, past, dashboard) => {
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
    ARRAY_AGG(
      CAST(v_id as CHAR(10)) || ' &$%& ' ||
      v_first_name || ' ' || v_last_name || ' &$%& ' ||
      v_email || ' &$%& ' ||
      CAST(CASE WHEN volunteers.deleted IS NULL THEN 'false' ELSE 'true' END AS CHAR(10)) || ' &$%& ' ||
      CAST(ev_id as CHAR(10))|| ' &$%& ' ||
      CAST(CASE WHEN event_volunteers.confirmed THEN 'true' ELSE 'false' END AS CHAR(10))
    ) AS volunteers_list
    
  FROM events
  INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
  LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
  LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
  `
  // const selectQueryOriginal = `
  // SELECT 
  //   event_id, 
  //   topic, 
  //   event_start, 
  //   event_end, 
  //   description, 
  //   staff_description,
  //   location, 
  //   instructor, 
  //   number_of_volunteers, 
  //   cohort,
  //   cohort_id,
  //   materials_url

  // FROM events
  // INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
  // LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
  // LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
  // `
  // ARRAY_AGG ( 
  //   DISTINCT
  //   CASE 
  //     WHEN event_volunteers.confirmed = TRUE 
  //     THEN volunteers.v_email
  //     END
  // ) AS v_email

  const endOfQuery = `
    GROUP BY
      event_id,
      cohort_id
    ORDER BY (
      CASE 
        WHEN event_start > NOW()
          THEN 2
        WHEN event_end > NOW()
          THEN 1
        ELSE 0
        END
      ) DESC, event_start ASC
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

  // DETOUR for dashboard retrieval
  if (dashboard) {
    const
      todaysQueryEnd = condition + `
        AND event_end::DATE >= now()::DATE AND event_start::DATE <= now()::DATE
        GROUP BY
          event_id,
          cohort_id
        ORDER BY event_start ASC;
      `,
      importantsQuery = `
        SELECT *
        FROM events 
        WHERE event_start::DATE > now()::DATE AND important = TRUE
        ORDER BY event_start ASC
        LIMIT 3;
      `,
      upcomingsQuery = `
        SELECT *
        FROM events 
        WHERE event_start::DATE > now()::DATE AND important = FALSE
        ORDER BY event_start ASC
        LIMIT 3;
      `;
    return db.multi(selectQuery + todaysQueryEnd + importantsQuery + upcomingsQuery)
      .then(([ todays, importants, upcomings ]) => {
          return { todays, importants, upcomings };
      });
  } else {
    return await db.any(selectQuery + condition + endOfQuery, { vName, topic, instructor });
  }
}

//Get Single Event for Admin
const getSingleEventAdmin = async (eId) => {
  const selectQuery = `
  SELECT events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
  events.instructor, events.number_of_volunteers AS volunteers_needed, cohorts.cohort, cohorts.cohort_id, materials_url, 
  ARRAY_AGG ( DISTINCT volunteers.v_first_name || ' ' || volunteers.v_last_name) AS volunteers
  
  FROM events
  INNER JOIN cohorts ON cohorts.cohort_id = events.attendees
  LEFT JOIN event_volunteers ON event_volunteers.eventv_id = events.event_id
  LEFT JOIN volunteers ON volunteers.v_id = event_volunteers.volunteer_id
  
  WHERE events.event_id = $/eId/ AND events.deleted IS NULL

  GROUP BY  events.event_id, events.topic, events.event_start, events.event_end, events.description, events.location, 
    events.instructor, events.number_of_volunteers, cohorts.cohort, cohorts.cohort_id 
  `
  return await db.one(selectQuery, { eId });
}

// // Get all upcoming events
// const getUpcomingEvents = async () => {
//   const selectQuery = `
//   SELECT * 
//   FROM events 
//   WHERE event_start > now() AND deleted IS NULL
//   ORDER BY event_start ASC
//   `;
//   return await db.any(selectQuery);
// }

// // Get all past events
// const getPastEvents = async () => {
//   const selectQuery = `
//   SELECT * 
//   FROM events 
//   WHERE event_start < now() AND deleted IS NULL
//   ORDER BY event_start ASC
//   `;
//   return await db.any(selectQuery);
// }

//Get all important events
const getImportantEvents = async (limit) => {
  let selectQuery = `
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
      ARRAY_AGG((
        SELECT
          CAST(v_id as CHAR(10)) || ' &$%& ' ||
          v_first_name || ' ' || v_last_name || ' &$%& ' ||
          v_email || ' &$%& ' ||
          CAST(CASE WHEN volunteers.deleted IS NULL THEN 'false' ELSE 'true' END AS CHAR(10)) || ' &$%& ' ||
          CAST(ev_id as CHAR(10))|| ' &$%& ' ||
          CAST(CASE WHEN event_volunteers.confirmed THEN 'true' ELSE 'false' END AS CHAR(10))

        FROM  event_volunteers
        LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id
        WHERE eventv_id = event_id GROUP BY eventv_id, v_id, ev_id) 
      ) AS volunteers_list
  
    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id

    WHERE event_start > now() AND important = TRUE AND events.deleted IS NULL
    GROUP BY event_id, cohort_id
    ORDER BY event_start ASC
  `
  // The reason why ' &$%& ' was selected to join the strings will be explained in the file frontend/src/Components/EventPreviewCard.jsx
  if (limit) {
    selectQuery += ' LIMIT $/limit/'
  }
  return await db.any(selectQuery, {limit});
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

// Get all past events by volunteer Id
const getPastEventsByVolunteerId = async (id) => {
  const selectQuery = `
  SELECT volunteers.v_id, volunteers.v_first_name || ' ' || volunteers.v_last_name AS volunteer, 
      event_id, topic, event_start, event_end, description, location, instructor, volunteered_time
  FROM volunteers
  INNER JOIN event_volunteers ON event_volunteers.volunteer_id = volunteers.v_id
  INNER JOIN events ON event_volunteers.eventv_id = events.event_id
  WHERE event_start < now() AND volunteers.v_id = $1 AND event_volunteers.confirmed = TRUE
  `;
  return await db.any(selectQuery, id);
}

// Get all upcoming events by volunteer Id
const getUpcomingEventsByVolunteerId = async (id, limit) => {
  let selectQuery = `
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
      ARRAY_AGG(CASE WHEN event_volunteers.confirmed THEN NULL ELSE NULL END) AS volunteers_list
      
    FROM events
    INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
    LEFT JOIN event_volunteers ON events.event_id = event_volunteers.eventv_id
    LEFT JOIN volunteers ON event_volunteers.volunteer_id = volunteers.v_id

    WHERE event_start > now() AND volunteer_id = $1 AND event_volunteers.confirmed = TRUE AND events.deleted IS NULL
    GROUP BY event_id, cohort_id
    ORDER BY event_start ASC
  `
  // let selectQuery = `
  //  SELECT event_id, topic, event_start, instructor, description, event_end, location, cohort
  //   FROM events 
  //   INNER JOIN event_volunteers ON event_id = ev_id
  //   INNER JOIN cohorts ON events.attendees = cohorts.cohort_id
  //   WHERE event_start > now() AND volunteer_id = $1 AND confirmed = TRUE
  //   ORDER BY event_start ASC
  // `;
  if (limit) {
    selectQuery += ' LIMIT $2'
  }
  return await db.any(selectQuery, [id, limit]);
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
  // getUpcomingEvents,
  // getPastEvents,
  getPastEventsByVolunteerId,
  getUpcomingEventsByVolunteerId,
  getPastEventsByFellowId,
  getImportantEvents,
  postEvent,
  editEvent,
  deleteEvent
}
