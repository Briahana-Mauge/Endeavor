/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
FELLOWS Route Queries | Capstone App (Pursuit Volunteer Mgr)
*/


/* DB CONNECTION */
const db = require('../db/db');


/* QUERIES */
const getAllFellows = async () => {
  const getQuery = `
    SELECT *
    FROM fellows
    ORDER BY f_id ASC;
  `;
  return await db.any(getQuery);
}


/* EXPORT */
module.exports = {
  getAllFellows
}
