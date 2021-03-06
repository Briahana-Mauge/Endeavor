import React from 'react';
import { Link } from 'react-router-dom';

export default function ProfileTabs(props) {
    return (
        <ul className='g1ProfileTabs nav nav-tabs flex-nowrap'>
            <li className='nav-item'>
                <Link className={`nav-link ${props.profileTab}`} to='/profile'>Change Profile Info</Link>
            </li>

            <li className='nav-item'>
                <Link className={`nav-link ${props.passwordTab}`} to='/profile/password'>Change Password</Link>
            </li>
        </ul>
    )
}