import React from 'react';

export default function GetNewPasswordInputs(props) {
    return (
        <>
            <label htmlFor="newPasswordTxt" className="g1TxtLabel">New Password</label>
            <input
                className='form-control'
                type='password'
                id='newPasswordTxt'
                placeholder=''
                value={props.newPassword}
                onChange={e => props.setNewPassword(e.target.value)}
            />
        </>
    )
}
