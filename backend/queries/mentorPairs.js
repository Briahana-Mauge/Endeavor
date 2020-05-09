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
        FROM mentor_pairs INNER JOIN volunteers ON mentor = v_id
        WHERE mentee = $1 AND mentor_pairs.deleted IS NULL
    `
    return await db.any(selectQuery, id);
}

const pairMentorMentee = async (volunteerId, fellowId) => {
    return await db.task(async (t) => {
        const selectQuery = 'SELECT m_id FROM mentor_pairs WHERE mentor = $/volunteerId/ AND mentee = $/fellowId/ AND deleted IS NULL';
        const relationExists = await t.oneOrNone(selectQuery, {volunteerId, fellowId});
    
        if (relationExists) {
            throw new Error('400__Relation exists already');
        }
    
        const insertQuery = `INSERT INTO mentor_pairs (mentor, mentee) VALUES ($/volunteerId/, $/fellowId/) RETURNING *`;
        return await t.one(insertQuery, {volunteerId, fellowId});
    });
}

const deleteMentorship = async (volunteerId, fellowId) => {
    const deleteQuery = `
        UPDATE mentor_pairs SET deleted = NOW() 
        WHERE mentor = $/volunteerId/ AND mentee = $/fellowId/ AND deleted IS NULL 
        RETURNING *`;
    return await db.one(deleteQuery, {volunteerId, fellowId});
}

module.exports = {
    getMentorPairByVolunteerId,
    getMentorPairByFellowId,
    pairMentorMentee,
    deleteMentorship
}