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
const volunteerQueries = require('../queries/volunteers');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailText = require('../emailBody/emailBody');

// SendGrid function to send an email
const sendEmail = async (messageData) => {
    try {
        await sgMail.send(messageData);
    } catch (err) {
        if (err.response) {
            console.log(err.response.body)
        } else {
            console.log(err);
        }
        throw new Error('500__The request was not completed.');
    }
}


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
                confirmed: processInput(request.body.confirmed, 'hardBool', 'volunteer confirmed')
            }

            const info = await volunteerQueries.getSpecificVolunteer(updateData.volunteerId, null, null);
            const event = await eventQueries.getSingleEvent(updateData.eventId)
            let volunteerInfo = {
                name: `${info.v_first_name} ${info.v_last_name}`,
                email: `endeavor.volunteer+${info.v_email.replace('@', '-')}@gmail.com`,
                event: event.topic
            }

            const messageData = {
                to: volunteerInfo.email,
                from: 'endeavorapp2020@gmail.com',
                subject: 'Event Request Status',
            };

            if (updateData.confirmed) {
                messageData.html = emailText.accepted(volunteerInfo.name, volunteerInfo.event, event.event_id);

            } else { //message sent when admin changes the request from approval to not approved.
                messageData.html = emailText.removed(volunteerInfo.name, volunteerInfo.event, event.event_id);
            }

            await sendEmail(messageData);

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
        const eventId = processInput(request.params.event_id, 'idNum', 'event id');
        if (request.user && request.user.v_id && request.user.v_id === volunteerId) {
            const postData = {
                eventId,
                volunteerId
            }

            // get updated data about the logged volunteer
            const volunteer = await volunteerQueries.getVolunteerByEmail(request.user.v_email);
            if (!volunteer.confirmed) { // if volunteer not confirmed to the platform they get notified 
                throw new Error('403__Sorry,\nyou can not request to volunteer for an event right now as your profile is being reviewed by an volunteer manager.\nPlease try again later');
            }

            const event = await eventQueries.getSingleEvent(eventId);
            const admin = await userQueries.getAllAdmin();
            const adminEmailsList = admin.map(admin => `endeavor.mng+${admin.a_email.replace('@', '-')}@gmail.com`);
            const name = request.user.v_first_name + ' ' + request.user.v_last_name;

            const messageData = {
                personalizations: [{
                    to: adminEmailsList
                }],
                from: 'endeavorapp2020@gmail.com',
                subject: 'Volunteer Event Request',
                html: emailText.request(name, volunteerId, event.topic, eventId),
            };

            await sendEmail(messageData);

            const volunteerRequest = await eventAttendeesQueries.signupVolunteerForEvent(postData);

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
            const eventId = processInput(request.params.event_id, 'idNum', 'event id');

            const promises= [];
            promises.push(userQueries.getAllAdmin());
            promises.push(eventQueries.getSingleEvent(eventId));
            const [admins, event] = await Promise.all(promises);
            const name = request.user.v_first_name + ' ' + request.user.v_last_name;
            const adminEmailsList = admins.map(admin => `endeavor.mng+${admin.a_email.replace('@', '-')}@gmail.com`);

            const messageData = {
                personalizations: [{
                    to: adminEmailsList
                }],
                from: 'endeavorapp2020@gmail.com',
                subject: 'Important! - A confirmed volunteer cancelled their participation for Event',
                html: emailText.cancelled(name, volunteerId, event.topic, event.event_id),
            };

            await sendEmail(messageData);

            const volunteerRequest = await eventAttendeesQueries.deleteVolunteerFromEvent({volunteerId, eventId});
            response.json({
                err: false,
                message: `Successfully deleted volunteer.${volunteerId} request to attend event.${eventId}`,
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
