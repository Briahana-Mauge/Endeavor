/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
SKILLS Route Handler | Capstone App (Pursuit Volunteer Mgr)
*/


/* MODULE INITS */
const express = require('express');
const router = express.Router();

const handleError = require('../helpers/handleError');
const processInput = require('../helpers/processInput');
const queries = require('../queries/skills');


/* MIDDLEWARE FUNCTIONS */
const getAllSkills = async (req, res, next) => {
  try {
    const allSkills = await queries.selectAllSkills();
    res.status(200);
    res.json({
        status: "success",
        message: "all skills retrieved",
        payload: allSkills
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const postSkill = async (req, res, next) => {
  try {
    const skill = processInput(req.body.skill, "hardVC", "skill name", 100);

    const response = await queries.insertSkill(skill);
    res.status(201);
    res.json({
        status: "success",
        message: `new skill '${skill}' added`,
        payload: response
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const putSkill = async (req, res, next) => {
  try {
    const skillId = processInput(req.params.skill_id, "idNum", "skill id");
    const skill = processInput(req.body.skill, "hardVC", "skill name", 100);

    const response = await queries.updateSkill({ skillId, skill });
    res.status(200);
    res.json({
        status: "success",
        message: `skill.${skillId} has been renamed to '${skill}'`,
        payload: response
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};

const delSkill = async (req, res, next) => {
  try {
    const skillId = processInput(req.params.skill_id, "idNum", "skill id");
    const response = await queries.deleteSkill(skillId);
    res.status(200);
    res.json({
        status: "success",
        message: `skill.${skillId} has been deleted`,
        payload: response
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
};


/* ENDPOINT HANDLERS */
router.get("/", getAllSkills);
router.post("/add/", postSkill);
router.put("/edit/:skill_id", putSkill);
router.delete("/del/:skill_id", delSkill);


module.exports = router;
