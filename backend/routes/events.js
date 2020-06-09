/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route  | Capstone App (Pursuit Volunteer Mgr)
*/
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');

const eventsQueries = require('../queries/events');


// Get all events
router.get('/all', async (req, res, next) => {
    try {
        const vName = processInput(req.query.v_name, "softVC", "volunteer name", 60).toLowerCase();
        const topic = processInput(req.query.topic, "softVC", "event topic", 50).toLowerCase();
        const instructor = processInput(req.query.instructor, "softVC", "event instructor", 100).toLowerCase();
        const upcoming = processInput(req.query.upcoming, "softBool", "upcoming events bool");
        const past = processInput(req.query.past, "softBool", "past events bool");

        let allEvents = null;
        
        if (req.user && req.user.a_id) {
            allEvents = await eventsQueries.getAllEventsAdmin(vName, topic, instructor, upcoming, past);
        } else if (req.user && req.user.v_id) {
            allEvents = await eventsQueries.getAllEvents(req.user.v_id, vName, topic, instructor, upcoming, past);
        } else {
            allEvents = await eventsQueries.getAllEvents(null, vName, topic, instructor, upcoming, past);
        }

        res.json({
            payload: allEvents,
            message: "Success",
            err: false
        });
    
    } catch (err) {
        handleError(err, req, res, next);
    }
});

//Get single event
router.get('/event/:e_id', async (req, res, next) => {
    try {
        const eventId = processInput(req.params.e_id, "idNum", "event id");

        let event = null;

        if (req.user && req.user.a_id) {
            console.log('ADMIN')
            event = await eventsQueries.getSingleEventAdmin(eventId);
        } else if (req.user && req.user.v_id) {
            event = await eventsQueries.getSingleEvent(eventId, req.user.v_id);
        } else {
            event = await eventsQueries.getSingleEvent(eventId, null);
        }

        res.json({
            payload: event,
            message: "Success",
            err: false
        });

    } catch (err) {
        handleError(err, req, res, next);
    }
})




// Get all events data used on admin dashboard
router.get('/dashboard/admin', async (req, res, next) => {
    try {
        if (!req.user || !req.user.a_id || !req.user.admin) {
            throw new Error('401__You must be a logged-in admin');
        } else {
            const adminDashboardEvents = await eventsQueries.getDashEventsForAdmin();
                res.status(200)
                .json({
                    payload: adminDashboardEvents,
                    message: "Success",
                    err: false
                });
        }
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all events data used on volunteer dashboard
router.get('/dashboard/volunteer', async (req, res, next) => {
    try {
        if (!req.user || !req.user.v_id) {
            throw new Error('401__You must be a logged-in volunteer');
        } else {
            const volunteerDashboardEvents = await eventsQueries.getDashEventsForVolunteer(req.user.v_id);
            res.status(200)
                .json({
                    payload: volunteerDashboardEvents,
                    message: "Success",
                    err: false
                });
        }
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Add new event
router.post('/add', async (req, res, next) => {
    try {
        if (req.user && req.user.a_id) {
            const eventData = {
                start: processInput(req.body.start, 'hardVC', 'event start date and time', 25),
                end: processInput(req.body.end, 'hardVC', 'event end date and time', 25),
                topic: processInput(req.body.topic, 'hardVC', 'topic', 100),
                description: processInput(req.body.description, 'hardVC', 'description'),
                staffDescription: processInput(req.body.staffDescription, 'softVC', 'staff description'),
                attendees: processInput(req.body.attendees, 'idNum', 'attendees id'),
                location: processInput(req.body.location, 'hardVC', 'location', 200),
                instructor: processInput(req.body.instructor, 'hardVC', 'instructor', 100),
                numberOfVolunteers: processInput(req.body.numberOfVolunteers, 'idNum', 'number of volunteers'),
                materialsUrl: processInput(req.body.materialsUrl, 'softVC', 'materials url'),
                important: processInput(req.body.important, 'hardBool', 'event importance')
            }

            const events = await eventsQueries.postEvent(eventData);
            res.status(201).json({
                payload: events,
                message: "Success",
                err: false
            });
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }

    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Edit event by Id
router.put('/edit/:event_id', async (req, res, next) => {
    try {
        if (req.user && req.user.a_id) {
            const eventData = {
                eventId: processInput(req.params.event_id, 'idNum', 'event Id'),
                start: processInput(req.body.start, 'hardVC', 'event start date and time', 25),
                end: processInput(req.body.end, 'hardVC', 'event end date and time', 25),
                topic: processInput(req.body.topic, 'hardVC', 'topic', 100),
                description: processInput(req.body.description, 'hardVC', 'description'),
                staffDescription: processInput(req.body.staffDescription, 'softVC', 'staff description'),
                attendees: processInput(req.body.attendees, 'idNum', 'attendees id'),
                location: processInput(req.body.location, 'hardVC', 'location', 200),
                instructor: processInput(req.body.instructor, 'hardVC', 'instructor', 100),
                numberOfVolunteers: processInput(req.body.numberOfVolunteers, 'idNum', 'number of volunteers'),
                materialsUrl: processInput(req.body.materialsUrl, 'softVC', 'materials url'),
                important: processInput(req.body.important, 'hardBool', 'event importance')
            }
            
            const events = await eventsQueries.editEvent(eventData);
            res.json({
                payload: events,
                message: "Success",
                err: false
            });
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }

    } catch (err) {
        handleError(err, req, res, next);
    }
});


// Delete an event by its ID
router.delete('/:event_id', async (req, res, next) => {
    try {
        const eventId = processInput(req.params.event_id, 'idNum');
        if (req.user && req.user.a_id) {
            const deletedEvent = await eventsQueries.deleteEvent(eventId);
            res.json({
                payload: deletedEvent,
                message: `Successfully deleted event.${eventId}`,
                err: false
            });
        } else {
            throw new Error('403__Not allowed to perform this operation');
        }
    } catch (err) {
        handleError(err, req, res, next);
    }
});


module.exports = router;
