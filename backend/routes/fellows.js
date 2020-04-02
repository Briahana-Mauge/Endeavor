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

    const fellowByEmail = await queries.getUserByEmail(fEmail);
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

// const createFellow = async (req, res, next) => {
//   const firstname = processInput(req.body.f_first_name, res, "hardVarchar30", "firstname");
//   const lastname = processInput(req.body.f_last_name, res, "hardVarchar30", "lastname");
//   const picture = processInput(req.body.f_picture, res, "softVarcharNoLimit", "picture url");
//   const bio = processInput(req.body.f_bio, res, "softVarcharNoLimit", "bio");
//   const linkedIn = processInput(req.body.f_linkedin, res, "softVarchar150", "linkedin url");
//   const github = processInput(req.body.f_github, res, "softVarchar150", "github url");
//   const cohortId = processInput(req.body.cohort_id, res, "idNum", "cohort id");
//   const wantMentor = processInput(req.body.want_mentor, res, "bool", "want mentor bool");

//   try {
//     const response = await queries.addFellow({
//         firstname,
//         lastname,
//         picture,
//         bio,
//         linkedIn,
//         github,
//         cohortId,
//         wantMentor
//     });
//     res.status(201);
//     res.json({
//         status: "success",
//         message: `new fellow '${firstname} ${lastname}' added`,
//         payload: response
//     });
//   } catch (err) {
//     handleError(err, req, res, next);
//   }
// };

// const updateFellow = async (req, res, next) => {
//   try {
//     const fellowId = processInput(req.params.fellow_id, res, "idNum", "fellow id");
//     const firstname = processInput(req.body.f_first_name, res, "hardVarchar30", "firstname");
//     const lastname = processInput(req.body.f_last_name, res, "hardVarchar30", "lastname");
//     const picture = processInput(req.body.f_picture, res, "softVarcharNoLimit", "picture url");
//     const bio = processInput(req.body.f_bio, res, "softVarcharNoLimit", "bio");
//     const linkedIn = processInput(req.body.f_linkedin, res, "softVarchar150", "linkedin url");
//     const github = processInput(req.body.f_github, res, "softVarchar150", "github url");
//     const cohortId = processInput(req.body.cohort_id, res, "idNum", "cohort id");
//     const wantMentor = processInput(req.body.want_mentor, res, "bool", "want mentor bool");

//     const response = await queries.editFellow({
//         fellowId,
//         firstname,
//         lastname,
//         picture,
//         bio,
//         linkedIn,
//         github,
//         cohortId,
//         wantMentor
//     });
//     res.status(201);
//     res.json({
//         status: "success",
//         message: `fellow.${fellowId} data updated`,
//         payload: response
//     });
//   } catch (err) {
//     handleError(err, req, res, next);
//   }
// };


/*
// f_id SERIAL PRIMARY KEY,
f_first_name VARCHAR (30) NOT NULL,
f_last_name VARCHAR (30) NOT NULL,
// f_email VARCHAR (50) REFERENCES users_data(user_email),
f_picture VARCHAR,
f_bio VARCHAR,
f_linkedin VARCHAR (150),
f_github VARCHAR (150),
cohort INT REFERENCES classes(class_id),
want_mentor BOOLEAN NOT NULL DEFAULT FALSE
*/


/* ENDPOINT HANDLERS */
router.get("/", readAllFellows);
router.get("/id/:id", readFellowById);
router.get("/email/:email", readFellowByEmail);
// router.post("/create", createFellow);
// router.put("/update/:fellow_id", updateFellow);


module.exports = router;
