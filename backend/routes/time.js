/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Time Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/

const express = require('express');
const router = express.Router();
const db = require('../db/db');

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const timeQueries = require('../queries/time');

//Gets the number of hours banked by a volunteer
router.get('/hours/:v_id', async (req, res, next) => {
    try {
        const vId = processInput(req.params.v_id, "idNum", "volunteer id");
        let allBankedHours = await timeQueries.allBankedHours(vId);

        res.status(200)
            .json({
                payload: allBankedHours,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
});


//Gets the number of hours by all volunteers
router.get('/', async (req, res, next) => {
    try {
        let allHours = await timeQueries.allHours();

        res.status(200)
            .json({
                payload: allHours,
                message: "Success",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
});

router.patch('/update', async (req, res, next) => {
    try {
        let vId = processInput(req.body.v_id, 'idNum', 'volunteer id');
        let hours = processInput(req.body.hours, 'idNum', 'num of hours')
        let updateHours = await timeQueries.updateVolunteerHours(vId, hours)
        res.status(200)
            .json({
                payload: updateHours,
                message: "Success",
                err: false
            });
    }catch(err){
        handleError(err, req, res, next);
    }
})

module.exports = router;
