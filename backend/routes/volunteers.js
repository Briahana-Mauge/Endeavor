var express = require('express');
var router = express.Router();
const db = require('../db/db');

router.get('/all', async (req, res) => {
    try {
        let allVolunteers = await db.any("SELECT * FROM volunteer");

        res.json({
            users: allVolunteers,
            message: "Success"
        });
    } catch (error) {
        res.json({
            message: "Error"
        });
        console.log(error);
    }
});

// Get all new (unconfirmed) volunteers
router.get('/new', async (req, res) => {
    try {
        let newVolunteers = await db.any("SELECT * FROM volunteers WHERE confirmed = 'false'");

        res.json({
            users: newVolunteers,
            message: "Success"
        });
    } catch (error) {
        res.json({
            message: "Error"
        });
        console.log(error);
    }
});

// Get all volunteers by some filter
router.get('/', async (req, res) => {
    /*stuff goes here */
});

// Patch volunteer confirmed status to true or false
router.patch('/', async (req, res) => {
    /*stuff goes here */
});

// Patch volunteer active status to true or false
router.patch('/', async (req, res) => {
    /*stuff goes here */
});

module.exports = router;
