var express = require('express');
var router = express.Router();
const db = require('../db/db');

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
        res.status(400)
            .json({
                payload: null,
                msg: "Did not retrieve all volunteers",
                err: true
            });
        console.log(error);
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
        res.status(400)
            .json({
                payload: null,
                message: "Did not retrieve all unconfirmed volunteers",
                err: true
            });
        console.log(err);
    }
});

// Get volunteer by email
router.get('/email/:v_email', async (req, res) => {
    try {
        const vEmail = req.params.v_email;

        let volunteer = await volunteerQueries.getVolunteerByEmail(vEmail);
        res.status(200)
            .json({
                payload: volunteer,
                message: "Success",
                err: false
            });
    } catch (err) {
        res.status(400)
            .json({
                payload: null,
                message: "Did not retrieve volunteer by email",
                err: true
            });
        console.log(err);
    }
})

// Get all volunteers by some filter
router.get('/', async (req, res) => {
    /*stuff goes here */
});

module.exports = router;
