const db = require('../db/db');

const userQueries = require('./users');

const getUserByEmail = async (email) => {
    return await db.one('SELECT * FROM administration WHERE a_email = $1', email)
}

const addAdmin = async (firstName, LastName, email, password) => {
    await userQueries.addUser(email, password, 'admin');

    const insertQuery = `
        INSERT INTO administration (a_first_name, a_last_name, a_email) VALUES
        ($1, $2, $3) RETURNING *
    `
    return await db.one(insertQuery, [firstName, LastName, email])
}


module.export = {
    getUserByEmail,
    addAdmin,
}