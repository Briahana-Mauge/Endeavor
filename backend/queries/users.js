const db = require('../db/db')

const getUserByEmail = async (email) => {
    return await db.one('SELECT * FROM users_data WHERE user_email = $1', email)
}

const addUser = async (email, password, role) => {
    const insertQuery = `
        INSERT INTO users_data (user_email, password, role) VALUES
        ($1, $2, $3) RETURNING *
    `
    return await db.one(insertQuery, [email, password, role])
}

const updatePassword = async (email, password) => {
    return await db.one('UPDATE users_data SET password = $2 WHERE user_email = $1 RETURNING *', [email, password]);
}

const updateEmail = async (oldEmail, newEmail) => {
    return await db.one('UPDATE users_data SET user_email = $2 WHERE user_email = $1 RETURNING *', [oldEmail, newEmail]);
}

const deleteUser = async (email) => {
    return await db.one('DELETE FROM users_data WHERE user_email = $1 RETURNING *', email);
}

module.export = {
    getUserByEmail,
    addUser,
    updatePassword,
    updateEmail,
    deleteUser,
}