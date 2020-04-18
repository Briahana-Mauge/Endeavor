/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */

// Get all volunteers attending an event by its Id
const getEventVolunteersByEventId = async (id) => {
    const selectQuery = `
        SELECT 
            v_id,
            v_first_name,
            v_last_name,
            volunteers.deleted,
            ev_id AS event_volunteer_id,
            event_volunteers.confirmed AS volunteer_request_accepted
        FROM event_volunteers INNER JOIN volunteers ON volunteer_id = v_id
        WHERE eventv_id = $/id/
    `
    return await db.any(selectQuery, {id});
}

// Confirm or un-confirm a volunteer request to be at en event
const manageVolunteerRequest = async (requestObject) => {
    const updateQuery = `
        UPDATE event_volunteers
        SET confirmed = $/confirmed/
        WHERE volunteer_id = $/volunteerId/
        AND eventv_id = $/eventId/
        RETURNING *
    `
    return await db.one(updateQuery, requestObject);
}


module.exports = {
    getEventVolunteersByEventId,
    manageVolunteerRequest,
}