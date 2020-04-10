import React from 'react';
import { useLocation } from 'react-router-dom';

import AdminToolsTabs from './AdminToolsTabs';
import UsersTab from './UsersTab';


export default function AdminTools(props) {
    const path = useLocation().pathname.split('/');
    
    let tab = '';
    if (path[2]) {
        tab = path[2];
    }

    return (
        <>
            <AdminToolsTabs 
                skillsTab={tab === 'skills' ? 'active' : ''}
                cohortsTab={tab === 'cohorts' ? 'active' : ''}
                usersTab={tab === 'users' ? 'active' : ''}
            />

            {
                tab === 'skills'
                ? null
                : null
            }

            {
                tab === 'cohorts'
                ? null
                : null
            }

            {
                tab === 'users'
                ? <UsersTab setFeedback={props.setFeedback} />
                : null
            }

        </>
    )
}