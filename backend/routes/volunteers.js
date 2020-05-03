/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Volunteers Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const volunteerQueries = require('../queries/volunteers');
const volunteerSkillsQueries = require('../queries/volunteerSkills');


router.get('/all', async (req, res, next) => {
    try {
        const vEmail = processInput(req.query.v_email, "softVC", "volunteer email", 50).toLowerCase();
        const company = processInput(req.query.company, "softVC", "volunteer company", 50).toLowerCase();
        const skill = processInput(req.query.skill, "softVC", "volunteer skill", 100).toLowerCase();
        const name = processInput(req.query.name, "softVC", "volunteer name", 60).toLowerCase();

        let publicProfilesOnly = true;
        if (req.user && req.user.a_id) {
            publicProfilesOnly = false;
        }

        let volunteerId = null;
        if (req.user && req.user.v_id) {
            volunteerId = req.user.v_id;
        }

        const allVolunteers = await volunteerQueries.getAllVolunteers(vEmail, company, skill, name, publicProfilesOnly, volunteerId);
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
router.get('/new', async (req, res, next) => {
    try {
        if (req.user && req.user.a_id) {
            const newVolunteers = await volunteerQueries.getNewVolunteers();
            res.status(200)
                .json({
                    payload: newVolunteers,
                    message: "Success",
                    err: false
                });
        } else {
            throw new Error('403_Admin right only');
        }
    } catch (err) {
        handleError(err, req, res, next);
    }
});

// Get volunteer by email
router.get('/email/:v_email', async (req, res, next) => {
    try {
        const email = processInput(req.params.v_email, "hardVC", "volunteer email", 50);

        let publicProfilesOnly = true;
        if (req.user && req.user.a_id) {
            publicProfilesOnly = false;
        }

        let volunteerId = null;
        if (req.user && req.user.v_id) {
            volunteerId = req.user.v_id;
        }

        const volunteer = await volunteerQueries.getVolunteerByIdOrEmail(null, email, publicProfilesOnly, volunteerId);
        res.json({
                payload: volunteer,
                message: "Successfully retrieved volunteer's info",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Get volunteer by id
router.get('/id/:volunteer_id', async (req, res, next) => {
    try {
        const id = processInput(req.params.volunteer_id, 'idNum', 'volunteer id');

        let publicProfilesOnly = true;
        if (req.user && req.user.a_id) {
            publicProfilesOnly = false;
        }

        let volunteerId = null;
        if (req.user && req.user.v_id) {
            volunteerId = req.user.v_id;
        }

        const volunteer = await volunteerQueries.getVolunteerByIdOrEmail(id, null, publicProfilesOnly, volunteerId);
        res.json({
                payload: volunteer,
                message: "Successfully retrieved volunteer's info",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Get volunteer's skills
router.get('/skills/:volunteer_id', async (req, res, next) => {
    try {
        const volunteerId = processInput(req.params.volunteer_id, 'idNum', 'volunteer id');
        const allVolunteerSkills = await volunteerSkillsQueries.getVolunteerSkills(volunteerId);
        res.json({
            error: false,
            message: `All volunteer with id ${volunteerId} skills retrieved`,
            payload: allVolunteerSkills || {skills_list: []} // if volunteer didn't select any skill from the list of skills
        });
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Accept a volunteer into the platform
router.patch('/confirm/:volunteer_id', async (req, res, next) => {
    try {
        const volunteerId = processInput(req.params.volunteer_id, 'idNum', 'volunteer id');
        if (req.user && req.user.admin) {
            const confirmedVolunteer = await volunteerQueries.confirmVolunteer(volunteerId);
            res.json({
                error: false,
                message: `Volunteer with id ${volunteerId} has been confirmed`,
                payload: confirmedVolunteer 
            });
        } else {
            throw new Error('403_You are not authorized to perform this operation');
        }
    } catch (err) {
        handleError(err, req, res, next);
    }
})

// Get all volunteers by some filter
// router.get('/', async (req, res) => {
//     /*stuff goes here */
// });

module.exports = router;
