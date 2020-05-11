import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import FirstAndLastNameInputs from '../LoginSignup/FirstAndLastNameInputs';
import EmailPassword from '../LoginSignup/EmailPassword';
import ProfileTabs from './ProfileTabs';
import PasswordUpdate from './PasswordUpdate';
import FileUpload from './FileUpload';


export default function AdminProfile(props) {
    const {
        loggedUser,
        email,
        setEmail,
        password,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        newPassword,
        confirmPassword,
    } = props;

    const {pathname} = useLocation();
    const pathName = pathname.split('/');

    const [ picFile, setPicFile ] = useState(null);

    useEffect(() => {
        setFirstName(loggedUser.a_first_name);
        setLastName(loggedUser.a_last_name);
        setEmail(loggedUser.a_email);
    }, [loggedUser, setFirstName, setLastName, setEmail]);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        try {
            if (email && password && firstName && lastName) {
                let profile = null;
                
                if (picFile) {
                    profile = new FormData();
                    profile.append('email', email);
                    profile.append('password', password);
                    profile.append('firstName', firstName);
                    profile.append('lastName', lastName);
                    profile.append('picture', picFile);
                } else {
                    profile = {
                        email,
                        password,
                        firstName,
                        lastName
                    }
                }

                const { data } = await axios.put(`/api/auth/${loggedUser.a_id}`, profile);
                props.settleUser(data.payload);
                props.setPassword('');
                props.setFeedback({message: 'Profile updated successfully'});
            } else {
                props.setFeedback({message: 'All fields are required'});
            }

        } catch (err) {
            props.setFeedback(err);
        }
    }

    return (
        <>
            {
                pathName[2] && pathName[2].toLowerCase() === 'password' 
                ?   <>
                        <ProfileTabs profileTab='' passwordTab='active'/>
                        <form className='form-row mt-3' onSubmit={props.handleUpdatePassword}>
                            <PasswordUpdate 
                                password={password}
                                setPassword={props.setPassword}
                                newPassword={newPassword}
                                setNewPassword={props.setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={props.setConfirmPassword}
                            />

                            <button type='submit' className='btn btn-primary'>Update</button>
                        </form>
                    </>

                :   <>
                        <ProfileTabs profileTab='active' passwordTab=''/>
                        <form className='form-row mt-3' onSubmit={handleUpdateInfo}>
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
                            
                            <FileUpload imageLink={loggedUser.a_picture} setPicFile={setPicFile}/>

                            <div className='col-sm-6'>
                                <button type='submit' className='btn btn-primary mr-5'>Update</button>
                            </div>
                        </form>

                        <br />
                        <button className='btn btn-danger' onClick={props.deleteAccount}>Delete Account</button>
                    </>
            }

        </>
    )
}