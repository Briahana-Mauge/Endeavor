/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/

const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const eventAttendeesQueries = require('../queries/eventAttendees');
const userQueries = require('../queries/users');
const eventQueries = require('../queries/events');

const sgMail = require('@sendgrid/mail');

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
        if (request.user && request.user.admin) {
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
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Volunteer request to attend an event
router.post('/event/:event_id/add/:volunteer_id', async (request, response, next) => {
    try {
        const volunteerId = processInput(request.params.volunteer_id, 'idNum', 'volunteer id');
        if (request.user && request.user.v_id && request.user.v_id === volunteerId) {
            const postData = {
                eventId: processInput(request.params.event_id, 'idNum', 'event id'),
                volunteerId
            }
            const volunteerRequest = await eventAttendeesQueries.signupVolunteerForEvent(postData);
            const event = await eventQueries.getSingleEvent(postData.eventId)
            const admin = await userQueries.getAllAdmin();


            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                personalizations: [{
                    to: []
                }],
                from: 'endeavorapp2020@gmail.com',
                subject: 'Volunteer Event Request',
                text: `${new Date().toLocaleString()}: ${request.user.v_first_name} ${request.user.v_last_name} requested to volunteer for the '${event.topic}' event.`,
            };
            for (let i = 0; i < admin.length; i++) {
                msg.personalizations[0].to.push({ email: admin[i].a_email })
            }
            (async () => {
                try {
                    await sgMail.send(msg);
                } catch (error) {
                    console.error(error);

                    if (error.response) {
                        console.error(error.response.body)
                    }
                }
            })();

            response.json({
                err: false,
                message: `Successfully added volunteer.${volunteerId} request to attend event.${postData.eventId}`,
                payload: volunteerRequest,
            });
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }

    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Volunteer request to attend an event
router.delete('/event/:event_id/delete/:volunteer_id', async (request, response, next) => {
    try {
        const volunteerId = processInput(request.params.volunteer_id, 'idNum', 'volunteer id');
        if (request.user && request.user.v_id && request.user.v_id === volunteerId) {
            const deleteData = {
                eventId: processInput(request.params.event_id, 'idNum', 'event id'),
                volunteerId
            }
            const volunteerRequest = await eventAttendeesQueries.deleteVolunteerFromEvent(deleteData);

            response.json({
                err: false,
                message: `Successfully deleted volunteer.${volunteerId} request to attend event.${deleteData.eventId}`,
                payload: volunteerRequest,
            });

        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Manage a volunteer volunteered hours for a specific event
router.put('/event/:event_id/volunteer/:volunteer_id', async (request, response, next) => {
    try {
        if (request.user && request.user.admin) {
            const updateData = {
                eventId: processInput(request.params.event_id, 'idNum', 'event id'),
                volunteerId: processInput(request.params.volunteer_id, 'idNum', 'volunteer id'),
                volunteeredHours: processInput(request.body.volunteeredHours, 'idNum', 'volunteered hours')
            }
            const volunteer = await eventAttendeesQueries.manageVolunteerHours(updateData);

            response.json({
                err: false,
                message: `Successfully updated volunteer.${updateData.volunteerId} hours`,
                payload: volunteer,
            });
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});


module.exports = router;
