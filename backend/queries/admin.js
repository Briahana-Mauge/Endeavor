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

const updateAdmin = async (id, firstName, LastName, email) => {
    const updateQuery = `
        UPDATE administration 
            SET a_first_name = $2, a_last_name = $3, a_email = $4 
            WHERE a_id = $1
            RETURNING *
    `
    return await db.one(insertQuery, [id, firstName, LastName, email])
}


module.export = {
    getUserByEmail,
    addAdmin,
    updateAdmin,
}