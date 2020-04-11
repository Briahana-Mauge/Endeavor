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

router.get('/all/', async (req, res, next) => { //change email to name

    try {
        const vEmail = processInput(req.query.v_email, "softVC", "volunteer email", 50);
        const company = processInput(req.query.company, "softVC", "volunteer company", 50);
        const skill = processInput(req.query.skill, "softVC", "volunteer skill", 100);
        const name = processInput(req.query.name, "softVC", "volunteer name", 60);

        const allVolunteers = await volunteerQueries.getAllVolunteers(vEmail, company, skill, name);
        res.status(200)
            .json({
                payload: allVolunteers,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
        console.log(err)
    }
});

// Get all new (unconfirmed) volunteers
router.get('/new', async (req, res, next) => {
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
router.get('/email/:v_email', async (req, res, next) => {
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
