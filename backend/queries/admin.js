const db = require('../db/db');

const userQueries = require('./users');


const getAdminByEmail = async (email) => {
    return await db.one('SELECT * FROM administration WHERE a_email = $1 AND deleted IS NULL', email)
}

const addAdmin = async (firstName, lastName, email, newPassword, oldPassword, admin) => {
    // Update the password of the new admin whom already registered into the users_data
    const registeredUser = await userQueries.updatePassword(email, newPassword);

    const insertQuery = `
        INSERT INTO administration (a_first_name, a_last_name, a_email, admin) VALUES
        ($1, $2, $3, $4) RETURNING *
    `

    try {
        return await db.one(insertQuery, [firstName, lastName, email, admin]);
    } catch (err) {
        if (registeredUser) { // if adding the new admin to administration table fails, the password gets reset
            await userQueries.updatePassword(email, oldPassword);
        }
        throw err;
    }
}

const updateAdmin = async (id, firstName, lastName, picture) => {
    const updateQuery = `
        UPDATE administration 
            SET a_first_name = $2, a_last_name = $3, a_picture = $4
            WHERE a_id = $1
            RETURNING *
    `
    return await db.one(updateQuery, [id, firstName, lastName, picture]);
}

const deleteAdmin = async (id) => {
    const deleteQuery = `
        UPDATE administration 
            SET deleted = NOW()
            WHERE a_id = $1
            RETURNING *
    `  
    return await db.one(deleteQuery, id);
}

const deleteAdminByEmail = async (email, promise) => {
    const deleteQuery = `
        UPDATE administration 
            SET deleted = NOW()
            WHERE a_email = $1
            RETURNING *
    `  
    if (promise) {
        return db.one(deleteQuery, email);
    }
    return await db.one(deleteQuery, email);
}

const updateViewType = async (userId, targetView) => {
    let updateQuery = `
        UPDATE administration 
        SET v_grid = NOT v_grid
        WHERE a_id = $/userId/
        RETURNING v_grid
    `

    if (targetView === 'events') {
        updateQuery = `
            UPDATE administration 
            SET e_grid = NOT e_grid
            WHERE a_id = $/userId/
            RETURNING e_grid
        `
    }

    return await db.one(updateQuery, {userId});
}


module.exports = {
    getAdminByEmail,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    deleteAdminByEmail,
    updateViewType
}