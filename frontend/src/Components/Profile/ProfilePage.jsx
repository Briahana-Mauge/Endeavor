import React, {useState} from 'react';
import axios from 'axios';

import AdminProfile from './AdminProfile';


export default function ProfilePage(props) {
    const {
        loggedUser,
        email,
        password,
        firstName,
        lastName,
        newPassword,
    } = props;

    const [ confirmPassword, setConfirmPassword ] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        try {
            if (password && newPassword && confirmPassword && newPassword === confirmPassword) {
                await axios.patch(`/api/users/${loggedUser.a_id}`, {password, newPassword, confirmPassword});
                props.setFeedback({message: 'Password was successfully updated'});
                props.setPassword('');
                props.setNewPassword('');
                setConfirmPassword('');

            } else {
                props.setFeedback({message: 'All fields are required OR confirmed password does not match new one'});
            }

        } catch (err) {
            props.setFeedback(err);
        }
    }

    const deleteAccount = async () => {
        const userId = loggedUser.a_id || loggedUser.v_id || loggedUser.f_id

        try {
            await axios.delete(`api/users/${userId}`);

        } catch (err) {
            props.setFeedback(err);
        }
    }

    return (
        <>
            {
            props.loggedUser.a_id
            ? <AdminProfile
                loggedUser={loggedUser}
                setFeedback={props.setFeedback} 
                setUser={props.setUser}
                email={email}
                setEmail={props.setEmail}
                password={password}
                setPassword={props.setPassword}
                firstName={firstName}
                setFirstName={props.setFirstName}
                lastName={lastName}
                setLastName={props.setLastName}
                newPassword={newPassword}
                setNewPassword={props.setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleUpdatePassword={handleUpdatePassword}
                deleteAccount={deleteAccount}
              />
            : null
          }
        </>
    )
}