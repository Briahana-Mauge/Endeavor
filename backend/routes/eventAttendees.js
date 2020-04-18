/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/

const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const eventAttendeesQueries = require('../queries/eventAttendees');


// Get all volunteers attending an event by its Id
router.get('/volunteers/:event_id', async (request, response, next) => {
    try {
        const eventId = processInput(request.params.event_id, 'idNum', 'event id');
        const volunteers = await eventAttendeesQueries.getEventVolunteersByEventId(eventId);

        response.json({
            err: false,
            message: `Successfully retrieved all the volunteers attending event.${eventId}`,
            payload: volunteers,
        });
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Confirm or un-confirm a volunteer request to be at en event
router.patch('/event/:event_id/volunteer/:volunteer_id', async (request, response, next) => {
    try {
        const updateData = {
            eventId: processInput(request.params.event_id, 'idNum', 'event id'),
            volunteerId: processInput(request.params.volunteer_id, 'idNum', 'volunteer id'),
            confirmed: processInput(request.body.confirmed, 'bool', 'volunteer confirmed')
        }
        const volunteer = await eventAttendeesQueries.manageVolunteerRequest(updateData);

        response.json({
            err: false,
            message: `Successfully updated volunteer.${updateData.volunteerId} attending event.${updateData.eventId}`,
            payload: volunteer,
        });
    } catch (err) {
        handleError(err, request, response, next);
    }
});


module.exports = router;
