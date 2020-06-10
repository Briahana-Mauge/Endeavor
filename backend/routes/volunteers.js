/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Volunteers Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const volunteerQueries = require('../queries/volunteers');


router.get('/all', async (req, res, next) => {
    try {
        const vEmail = processInput(req.query.v_email, "softVC", "volunteer email", 50).toLowerCase();
        const company = processInput(req.query.company, "softVC", "volunteer company", 50).toLowerCase();
        const skill = processInput(req.query.skill, "softVC", "volunteer skill", 100).toLowerCase();
        const name = processInput(req.query.name, "softVC", "volunteer name", 60).toLowerCase();
        const title = processInput(req.query.title, "softVC", "volunteer title", 50).toLowerCase();

        let publicProfilesOnly = true;
        if (req.user && req.user.a_id) {
            publicProfilesOnly = false;
        }

        let volunteerId = null;
        if (req.user && req.user.v_id) {
            volunteerId = req.user.v_id;
        }

        const allVolunteers = await volunteerQueries.getAllVolunteers(vEmail, company, skill, name, title, publicProfilesOnly, volunteerId);
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

//NOTE: Please make sure this route stays the last one
// Get volunteer by id, email or slug
router.get('/:type/:volunteer_id', async (req, res, next) => {
    try {
        const type = req.params.type;
        if (type !== 'email' && type !== 'id' && type !== 'slug') {
            throw new Error('404_wrong route');
        }
        let id = email = slug = null;

        if (type === 'id') {
            id = id = processInput(req.params.volunteer_id, 'idNum', 'volunteer id');
        }
        if (type === 'email') {
            email = processInput(req.params.volunteer_id, "hardVC", "volunteer email", 50).toLowerCase();
        }
        if (type == 'slug') {
            slug = processInput(req.params.volunteer_id, "hardVC", "volunteer slug", 30).toLowerCase();
        }

        let publicProfilesOnly = true;
        if (req.user && req.user.a_id) {
            publicProfilesOnly = false;
        }

        let volunteerId = null;
        if (req.user && req.user.v_id) {
            volunteerId = req.user.v_id;
        }

        const volunteer = await volunteerQueries.getSpecificVolunteer(id, email, slug);
        if (publicProfilesOnly && !volunteer.public_profile && volunteer.v_id !== volunteerId){
            throw new Error('403__Not accessible');
        }

        res.json({
                payload: volunteer,
                message: "Successfully retrieved volunteer's info",
                err: false
            });
    } catch (err) {
        handleError(err, req, res, next);
    }
})


module.exports = router;
