/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Events Route  | Capstone App (Pursuit Volunteer Mgr)
*/
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');

const eventsQueries = require('../queries/events');


// HELPER FUNCTION TO CALCULATE DIFFERENCE IN HOURS BETWEEN TWO DATES
const calcHours = (date1, date2) => {
    const now = new Date().getTime();
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    const time = d2 - d1;
    if (time <= 0) {
        throw new Error('400__End date must be later then the start date');
    }
    if (d1 < now || d2 < now) {
        throw new Error('400__Events cannot be created for past times');
    }
    return Math.ceil(time / 3600000);
}

// Get all events (past events are auto pushed to the back)
router.get('/all/', async (req, res, next) => {
    try {
        const vName = processInput(req.query.v_name, "softVC", "volunteer name", 60).toLowerCase();
        const topic = processInput(req.query.topic, "softVC", "event topic", 50).toLowerCase();
        const instructor = processInput(req.query.instructor, "softVC", "event instructor", 100).toLowerCase();
        const upcoming = processInput(req.query.upcoming, "softVC", "upcoming events", 60);
        const past = processInput(req.query.past, "softVC", "past events", 60);

        let allEvents = await eventsQueries.getAllEvents(vName, topic, instructor, upcoming, past);
        res.status(200)
        .json({
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
        const eId = processInput(req.params.e_id, "idNum", "event id");

        let event = await eventsQueries.getSingleEvent(eId);
        res.status(200)
            .json({
                payload: event,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})


//Get all events  (admin)
router.get('/admin/all', async (req, res, next) => {
    try{
        const vName = processInput(req.query.v_name, "softVC", "volunteer name", 60).toLowerCase();
        const topic = processInput(req.query.topic, "softVC", "event topic", 50).toLowerCase();
        const instructor = processInput(req.query.instructor, "softVC", "event instructor", 100).toLowerCase();
        const upcoming = processInput(req.query.upcoming, "softVC", "upcoming events", 60);
        const past = processInput(req.query.past, "softVC", "past events", 60);

        let allEventsAdmin = await eventsQueries.getAllEventsAdmin(vName, topic, instructor, upcoming, past);
        res.status(200)
        .json({
            payload: allEventsAdmin,
            message: "Success",
            err: false
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
    
});

//Get single event (admin only)
router.get('/admin/event/:e_id', async (req, res, next) => {
    try {
        const eId = processInput(req.params.e_id, "idNum", "event id");

        let event = await eventsQueries.getSingleEventAdmin(eId);
        res.status(200)
            .json({
                payload: event,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Get all upcoming events
router.get('/upcoming', async (req, res, next) => {
    try {
        let allEvents = await eventsQueries.getUpcomingEvents();
        res.json({
            payload: allEvents,
            message: "Success",
            err: false
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all past events
router.get('/past', async (req, res, next) => {
    try {
        let allEvents = await eventsQueries.getPastEvents();
        res.json({
            payload: allEvents,
            message: "Success",
            err: false
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all past events by volunteer id
router.get('/past/volunteer/:volunteer_id', async (req, res, next) => {
    try {
        const volunteerId = processInput(req.params.volunteer_id, 'idNum', 'volunteer id');
        const events = await eventsQueries.getPastEventsByVolunteerId(volunteerId);
        res.json({
            payload: events,
            message: "Success",
            err: false
        });
      } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all past events by fellow id
router.get('/past/fellow/:fellow_id', async (req, res, next) => {
    try {
        const fellowId = processInput(req.params.fellow_id, 'idNum', 'volunteer id');
        const events = await eventsQueries.getPastEventsByFellowId(fellowId);
        res.json({
            payload: events,
            message: "Success",
            err: false
        });
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
                attendees: processInput(req.body.attendees, 'idNum', 'attendees id'),
                location: processInput(req.body.location, 'hardVC', 'location', 200),
                instructor: processInput(req.body.instructor, 'hardVC', 'instructor', 100),
                numberOfVolunteers: processInput(req.body.numberOfVolunteers, 'idNum', 'number of volunteers'),
                materialsUrl: processInput(req.body.materialsUrl, 'softVC', 'materials url'),
                eventDuration: processInput(req.body.eventDuration, 'idNum', 'event duration')
            }
    
            const calcEventTime = calcHours(eventData.start, eventData.end);
            if (calcEventTime < eventData.eventDuration) {
                throw new Error('400__Please double check the event duration');
            }

            const events = await eventsQueries.postEvent(eventData);
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
                attendees: processInput(req.body.attendees, 'idNum', 'attendees id'),
                location: processInput(req.body.location, 'hardVC', 'location', 200),
                instructor: processInput(req.body.instructor, 'hardVC', 'instructor', 100),
                numberOfVolunteers: processInput(req.body.numberOfVolunteers, 'idNum', 'number of volunteers'),
                materialsUrl: processInput(req.body.materialsUrl, 'softVC', 'materials url'),
                eventDuration: processInput(req.body.eventDuration, 'idNum', 'event duration')
            }
            
            const calcEventTime = calcHours(eventData.start, eventData.end);
            if (calcEventTime < eventData.eventDuration) {
                throw new Error('400__Please double check the event duration');
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
