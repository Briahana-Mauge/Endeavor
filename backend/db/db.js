/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Database Connection Helper | Capstone App (Pursuit Volunteer Mgr)
*/


const pgp = require('pg-promise')();
  const connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/capstone_project_db';
  const db = pgp(connectString);


module.exports = db;
