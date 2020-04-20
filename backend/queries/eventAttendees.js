/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/

/* DB CONNECTION */
const db = require('../db/db');

const eventsQueries = require('./events');


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
            volunteers.v_email,
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

// Signup volunteer to attend en event
const signupVolunteerForEvent = async (requestObject) => {
    return await db.task(async (t) => {
        const checkEventQuery = `
            SELECT (CASE
                    WHEN DATE(event_start) > NOW()
                    THEN TRUE
                    ELSE FALSE
                END) AS event_available
            FROM events
            WHERE event_id = $/eventId/
        `
        const eventAvailable = await t.one(checkEventQuery, requestObject);
        console.log(eventAvailable)
        if (eventAvailable.event_available) {
            const postQuery = `
                INSERT INTO event_volunteers (eventv_id, volunteer_id)
                VALUES ($/eventId/, $/volunteerId/)
                RETURNING *
            `
            return await t.one(postQuery, requestObject);
        } else {
            throw new Error('403__Sorry, this event has passed and you can not sign up for it');
        } 
    });
}

// Signup volunteer to attend en event
const deleteVolunteerFromEvent = async (requestObject) => {
    return await db.task(async (t) => {
        const checkEventQuery = `
            SELECT (CASE
                    WHEN DATE(event_start) > NOW()
                    THEN TRUE
                    ELSE FALSE
                END) AS event_available
            FROM events
            WHERE event_id = $/eventId/
        `
        const eventAvailable = await t.one(checkEventQuery, requestObject);
        console.log(eventAvailable)
        if (eventAvailable.event_available) {
            const deleteQuery = `
                DELETE FROM event_volunteers
                WHERE eventv_id = $/eventId/ AND volunteer_id = $/volunteerId/
                RETURNING *
            `
            return await t.one(deleteQuery, requestObject);
        } else {
            throw new Error('403__Sorry, this event has passed and you can not update it');
        }
    });

}


module.exports = {
    getEventVolunteersByEventId,
    manageVolunteerRequest,
    signupVolunteerForEvent,
    deleteVolunteerFromEvent,
}