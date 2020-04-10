import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminToolsTabs(props) {
    return (
        <ul className='nav nav-tabs'>
            <li className='nav-item'>
                <Link className={`nav-link ${props.skillsTab}`} to='/tools/skills'>Update Skills List</Link>
            </li>

            <li className='nav-item'>
                <Link className={`nav-link ${props.cohortsTab}`} to='/tools/cohorts'>Update Cohorts List</Link>
            </li>

            <li className='nav-item'>
                <Link className={`nav-link ${props.usersTab}`} to='/tools/users'>Update Users List</Link>
            </li>
        </ul>
    )
}