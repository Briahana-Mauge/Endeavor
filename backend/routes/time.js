var express = require('express');
var router = express.Router();
const db = require('../db/db');
const timeQueries = require('../queries/time');

//Gets the number of hours banked by a volunteer
router.get('/past/:v_id', async (req, res) => {
    try {
        const vId = req.params.v_id;
        let allBankedHours = await timeQueries.allBankedHours(vId);

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
router.get('/upcoming/:v_id', async (req, res) => {
    try {
        const vId = req.params.v_id;
        let allPlannedHours = await timeQueries.allPlannedHours(vId);
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
        let allHours = await timeQueries.allHours();

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