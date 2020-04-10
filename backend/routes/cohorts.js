/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
COHORTS Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/


/* MODULE INITS */
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const queries = require('../queries/cohorts');


/* MIDDLEWARE FUNCTIONS */
const getAllCohorts = async (req, res, next) => {
  try {
    const allCohorts = await queries.selectAllCohorts();
    res.status(200);
    res.json({
        status: "success",
        message: "all cohorts retrieved",
        payload: allCohorts
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const postCohort = async (req, res, next) => {
  try {
    if (req.user && req.user.a_id) {
      const cohort = processInput(req.body.cohort, "hardVC", "cohort name", 100);
  
      const response = await queries.insertCohort(cohort);
      res.status(201);
      res.json({
          status: "success",
          message: `new cohort '${cohort}' added`,
          payload: response
      });
    } else {
      throw new Error('403__Not allowed to perform this operation');
    }
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const putCohort = async (req, res, next) => {
  try {
    if (req.user && req.user.a_id) {
      const cohortId = processInput(req.params.cohort_id, "idNum", "cohort id");
      const cohort = processInput(req.body.cohort, "hardVC", "cohort name", 100);
  
      const response = await queries.updateCohort({ cohortId, cohort });
      res.status(200);
      res.json({
          status: "success",
          message: `cohort.${cohortId} has been renamed to '${cohort}'`,
          payload: response
      });
    } else {
      throw new Error('403__Not allowed to perform this operation');
    }
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const delCohort = async (req, res, next) => {
  try {
    if (req.user && req.user.a_id) {
      const cohortId = processInput(req.params.cohort_id, "idNum", "cohort id");
      const response = await queries.deleteCohort(cohortId);
      res.status(200);
      res.json({
          status: "success",
          message: `cohort.${cohortId} has been deleted`,
          payload: response
      });
    } else {
      throw new Error('403__Not allowed to perform this operation');
    }
  } catch (err) {
    handleError(err, req, res, next);
  }
};


/* ENDPOINT HANDLERS */
router.get("/", getAllCohorts);
router.post("/add/", postCohort);
router.put("/edit/:cohort_id", putCohort);
router.delete("/del/:cohort_id", delCohort);


module.exports = router;
