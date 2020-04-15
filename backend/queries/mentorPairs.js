const db = require('../db/db');


const getMentorPairByVolunteerId = async (id) => {
    const selectQuery = `
        SELECT * 
        FROM mentor_pairs INNER JOIN fellows ON mentee = f_id
        WHERE mentor = $1 AND mentor_pairs.deleted IS NULL
    `
    return await db.any(selectQuery, id);
}

const getMentorPairByFellowId = async (id) => {
    const selectQuery = `
        SELECT * 
        FROM mentor_pairs INNER JOIN volunteers ON mentee = v_id
        WHERE mentee = $1 AND mentor_pairs.deleted IS NULL
    `
    return await db.any(selectQuery, id);
}

module.exports = {
    getMentorPairByVolunteerId,
    getMentorPairByFellowId
}