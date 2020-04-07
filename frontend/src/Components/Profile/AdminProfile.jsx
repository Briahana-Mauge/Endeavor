import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import FirstAndLastNameInputs from '../LoginSignup/FirstAndLastNameInputs';
import EmailPassword from '../LoginSignup/EmailPassword';
import ProfileTabs from './ProfileTabs';

export default function AdminProfile(props) {
    const {
        loggedUser,
        email,
        password,
        firstName,
        lastName,
        newPassword,
    } = props;

    const {pathname} = useLocation();
    const pathName = pathname.split('/');

    useEffect(() => {
        props.setFirstName(loggedUser.a_first_name);
        props.setLastName(loggedUser.a_last_name);
        props.setEmail(loggedUser.a_email);
    }, [])

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {

        } catch (err) {
            props.setNetworkError(err);
        }
    }

    return (
        <>
            {
                pathName[2] && pathName[2].toLowerCase() === 'password' 
                ?   <>
                        <ProfileTabs profileTab='' passwordTab='active'/>
                    </>

                :   <>
                        <ProfileTabs profileTab='active' passwordTab=''/>
                        <form className='form-row mt-3' onSubmit={handleFormSubmit}>
                            <FirstAndLastNameInputs 
                                firstName={firstName}
                                setFirstName={props.setFirstName}
                                lastName={lastName}
                                setLastName={props.setLastName}
                            />

                            <EmailPassword 
                                email={email}
                                setEmail={props.setEmail}
                                password={password}
                                setPassword={props.setPassword}
                            />

                            <button type='submit' className='btn btn-primary'>Update</button>
                        </form>
                    </>
            }

        </>
    )
}