/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/

const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const mentorPairsQueries = require('../queries/mentorPairs');

//Get list of fellows mentored by a specific volunteer
router.get('/volunteer/:volunteer_id', async (request, response, next) => {
    try {
        const volunteerId = processInput(request.params.volunteer_id, 'idNum', 'volunteer id');
        const mentoring = await mentorPairsQueries.getMentorPairByVolunteerId(volunteerId);

        response.json({
            payload: mentoring,
            message: 'Success',
            err: false
        });
    } catch (err) {
        handleError(err, request, response, next);
    }
});

//Get list of volunteers mentoring a specific fellow
router.get('/fellow/:fellow_id', async (request, response, next) => {
    try {
        const fellowId = processInput(request.params.fellow_id, 'idNum', 'fellow id');
        const mentoring = await mentorPairsQueries.getMentorPairByFellowId(fellowId);

        response.json({
            payload: mentoring,
            message: 'Success',
            err: false
        });
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Pair a Mentor with a mentee
router.post('/', async (request, response, next) => {
    try {
        if (request.user && request.user.a_id) {
            const volunteerId = processInput(request.body.volunteerId, 'idNum', 'volunteer id');
            const fellowId = processInput(request.body.fellowId, 'idNum', 'fellow id');
    
            const mentoring = await mentorPairsQueries.pairMentorMentee(volunteerId, fellowId);
    
            response.json({
                payload: mentoring,
                message: 'Success',
                err: false
            });
        } else {
            throw new Error('403__Not authorized to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});

// Pair a Mentor with a mentee
router.delete('/volunteer/:volunteer_id/fellow/:fellow_id', async (request, response, next) => {
    try {
        if (request.user && request.user.a_id) {
            const volunteerId = processInput(request.params.volunteer_id, 'idNum', 'volunteer id');
            const fellowId = processInput(request.params.fellow_id, 'idNum', 'fellow id');
    
            const mentoring = await mentorPairsQueries.deleteMentorship(volunteerId, fellowId);
    
            response.json({
                payload: mentoring,
                message: 'Success',
                err: false
            });
        } else {
            throw new Error('403__Not authorized to perform this operation');
        }
    } catch (err) {
        handleError(err, request, response, next);
    }
});


module.exports = router;
