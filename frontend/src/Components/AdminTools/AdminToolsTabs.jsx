import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminToolsTabs(props) {
    return (
        <ul className='nav nav-tabs'>
            <li className='nav-item'>
                <Link className={`nav-link ${props.skillsTab}`} to='/tools/skills'>Edit Skills</Link>
            </li>

            <li className='nav-item'>
                <Link className={`nav-link ${props.cohortsTab}`} to='/tools/cohorts'>Edit Cohorts</Link>
            </li>

            <li className='nav-item'>
                <Link className={`nav-link ${props.usersTab}`} to='/tools/users'>Create Pursuit Accounts</Link>
            </li>
        </ul>
    )
}