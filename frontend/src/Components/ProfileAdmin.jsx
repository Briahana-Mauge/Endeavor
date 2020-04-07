import React from 'react';
import axios from 'axios';

import FirstAndLastNameInputs from './LoginSignup/FirstAndLastNameInputs';
import SignupAdminSubForm from './LoginSignup/SignupAdminSubForm';
import EmailPassword from './LoginSignup/EmailPassword';

export default function AdminProfile(props) {
    const {
        loggedUser,
        email,
        password,
        firstName,
        lastName,
        newPassword,
    } = props;


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {

        } catch (err) {
            props.setNetworkError(err);
        }
    }

    return (
        <form className='form-row' onSubmit={handleFormSubmit}>
            <FirstAndLastNameInputs 
                firstName={firstName}
                setFirstName={props.setFirstName}
                lastName={lastName}
                setLastName={props.setLastName}
            />
            <EmailPassword 

            
            />
        </form>
    )
}