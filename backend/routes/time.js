var express = require('express');
var router = express.Router();
const db = require('../db/db');

//Gets the number of hours banked by a volunteer
router.get('/past/:volunteer_id', async (req, res) => {
    try {
        let allBankedHours = await db.any("SELECT banked_hours FROM volunteer_hours WHERE volunteer = 'volunteer'");

        res.json({
            users: allBankedHours,
            message: "Success"
        });
    } catch (error) {
        res.json({
            message: "Error"
        });
        console.log(error);
    }
});

//Gets the number of hours planned by a volunteer
router.get('/upcoming/:volunteer_id', async (req, res) => {
    try {
        let allPlannedHours = await db.any("SELECT planned_time FROM volunteer_hours WHERE volunteer = 'volunteer'");

        res.json({
            users: allPlannedHours,
            message: "Success"
        });
    } catch (error) {
        res.json({
            message: "Error"
        });
        console.log(error);
    }
});

//Gets the number of hours by all volunteers
router.get('/', async (req, res) => {
    try {
        let allHours = await db.any("SELECT banked_hours FROM volunteer_hours");

        res.json({
            users: allHours,
            message: "Success"
        });
    } catch (error) {
        res.json({
            message: "Error"
        });
        console.log(error);
    }
});

module.exports = router;