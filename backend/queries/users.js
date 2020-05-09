const db = require('../db/db');


const getUserByEmail = async (email) => {
    return await db.oneOrNone('SELECT * FROM users_data WHERE user_email = $1 AND deleted IS NULL', email)
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
    const deleteQuery = `
        UPDATE users_data
        SET deleted = NOW(), user_email = $1 || '.delete'
        WHERE user_email = $1
        RETURNING *
    `
    return await db.one(deleteQuery, email);
}

const getAllAdmin = async () => {
    const getQuery = `
    SELECT a_email
    FROM administration
    WHERE admin = true AND deleted IS NULL;
    `;
    return await db.any(getQuery);
}


module.exports = {
    getUserByEmail,
    addUser,
    updatePassword,
    updateEmail,
    deleteUser,
    getAllAdmin,
}