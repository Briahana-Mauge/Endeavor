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
    const allFellows = await queries.getAllFellows();
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

const readFellow = async (req, res, next) => {
  try {
    const fellowId = processInput(req.params.fellow_id, "idNum", "fellow id");
    const fellowById = await queries.getFellowById(fellowId);
    res.status(200);
    res.json({
        status: "success",
        message: `fellow.${id} retrieved`,
        payload: fellowById
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const createFellow = async (req, res, next) => {
  try {
    const firstname = processInput(req.body.f_first_name, "hardVarchar30", "firstname");
    const lastname = processInput(req.body.f_last_name, "hardVarchar30", "lastname");
    const email = processInput(req.body.f_email, "hardVarchar30", "email");
    const picture = processInput(req.body.f_picture, "softText", "picture url");
    const bio = processInput(req.body.f_bio, "softText", "bio");
    const linkedIn = processInput(req.body.f_linkedin, "softVarchar60", "linkedin url");
    const github = processInput(req.body.f_github, "softVarchar60", "github url");
    const cohortId = processInput(req.body.cohort_id, "idNum", "cohort id");
    const wantMentor = processInput(req.body.want_mentor, "bool", "want mentor bool");

    const response = await queries.addFellow({
        firstname,
        lastname,
        email,
        picture,
        bio,
        linkedIn,
        github,
        cohortId,
        wantMentor
    });
    res.status(201);
    res.json({
        status: "success",
        message: `new fellow '${firstname} ${lastname}' added`,
        payload: response
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};


/*
*** f_id SERIAL PRIMARY KEY,
f_first_name VARCHAR (30) NOT NULL,
f_last_name VARCHAR (30) NOT NULL,
f_email VARCHAR (30) NOT NULL,
*** f_password VARCHAR NOT NULL,
f_picture VARCHAR,
f_bio VARCHAR,
f_linkedin VARCHAR (150),
f_github VARCHAR (150),
cohort INT REFERENCES classes(class_id),
want_mentor BOOLEAN NOT NULL DEFAULT FALSE
*/


/* ROUTE HANDLERS */
router.get("/", readAllFellows);
router.get("/:fellow_id", readFellow);
router.post("/create", createFellow);


module.exports = router;
