/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/


/* MODULE INITS */
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const queries = require('../queries/fellows');


/* MIDDLEWARE FUNCTIONS */
const readAllFellows = async (req, res, next) => {
  try {
    const name = processInput(req.query.name, 'softVC', 'fellow name', 120).toLowerCase();
    const requestedMentor = processInput(req.query.mentor, 'softVC', 'request mentor', 5).toLowerCase();
    let cohortId = req.query.cohort;
    if (isNaN(parseInt(cohortId)) || parseInt(cohortId).toString().length !== cohortId.length) {
      cohortId = '';
    }

    const allFellows = await queries.getAllFellows(name, cohortId, requestedMentor);
    res.status(200);
    res.json({
        status: "success",
        message: "all fellows retrieved",
        payload: allFellows
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const readFellowById = async (req, res, next) => {
  try {
    const fId = processInput(req.params.id, "idNum", "fellow id");

    const fellowById = await queries.getFellowById(fId);
    res.status(200);
    res.json({
        status: "success",
        message: `fellow.${fId} retrieved`,
        payload: fellowById
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const readFellowByEmail = async (req, res, next) => {
  try {
    const fEmail = processInput(req.params.email, "hardVC", "fellow email", 50);

    const fellowByEmail = await queries.getFellowByEmail(fEmail);
    res.status(200);
    res.json({
        status: "success",
        message: `fellow of ${fEmail} retrieved`,
        payload: fellowByEmail
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

/* ENDPOINT HANDLERS */
router.get("/", readAllFellows);
router.get("/id/:id", readFellowById);
router.get("/email/:email", readFellowByEmail);


module.exports = router;
