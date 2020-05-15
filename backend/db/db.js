/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Database Connection Helper | Capstone App (Pursuit Volunteer Mgr)
*/


const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);


module.exports = db;