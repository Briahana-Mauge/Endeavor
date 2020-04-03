/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Volunteers Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/
const express = require('express');
const router = express.Router();
const db = require('../db/db');

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const volunteerQueries = require('../queries/volunteers')

router.get('/', async (req, res) => {
    try {
        let allVolunteers = await volunteerQueries.getAllVolunteers();
        res.status(200)
            .json({
                payload: allVolunteers,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get all new (unconfirmed) volunteers
router.get('/new', async (req, res) => {
    try {
        let newVolunteers = await volunteerQueries.getNewVolunteers();
        res.status(200)
            .json({
                payload: newVolunteers,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get volunteer by email
router.get('/email/:v_email', async (req, res) => {
    try {
        const vEmail = processInput(req.params.v_email, "hardVC", "volunteer email", 50);

        let volunteer = await volunteerQueries.getVolunteerByEmail(vEmail);
        res.status(200)
            .json({
                payload: volunteer,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Get all volunteers by some filter
// router.get('/', async (req, res) => {
//     /*stuff goes here */
// });



module.exports = router;
