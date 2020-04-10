import React from 'react';
import { useLocation } from 'react-router-dom';

import AdminToolsTabs from './AdminToolsTabs';
import UsersTab from './UsersTab';
import CohortsTab from './CohortsTab';
import SkillsTab from './SkillsTab';


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
                ? <SkillsTab setFeedback={props.setFeedback} />
                : null
            }

            {
                tab === 'cohorts'
                ? <CohortsTab setFeedback={props.setFeedback} />
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