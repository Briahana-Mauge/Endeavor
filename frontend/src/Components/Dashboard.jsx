/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
Dashboard Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';

import AdminHome from './AdminHome';
import VolunteerHome from './VolunteerHome';
import DashboardVolunteers from './Dashboards/DashboardVolunteers'; 

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;
    console.log(setFeedback)

    return (
        <>
            {
                loggedUser && loggedUser.a_id
                ? <AdminHome loggedUser={loggedUser} setFeedback={setFeedback} />
                : null
            }
             {
                loggedUser && loggedUser.v_id
                ? <DashboardVolunteers loggedUser={loggedUser} setFeedback={setFeedback} />
                : null
            }
        </>
    )
}

export default Dashboard;