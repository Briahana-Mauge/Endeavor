/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Dashboard Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import AdminHome from './AdminHome'

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;

    return (
        <>
            {
                loggedUser && loggedUser.a_id
                ? <AdminHome loggedUser={loggedUser} setFeedback={setFeedback} />
                : null
            }
        </>
    )
}

export default Dashboard;