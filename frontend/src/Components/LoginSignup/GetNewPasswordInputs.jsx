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
            <label htmlFor="confirmPasswordTxt" className="g1TxtLabel">Confirm New Password</label>
            <input
                className='form-control'
                type='password'
                id='confirmPasswordTxt'
                placeholder=''
                value={props.confirmPassword}
                onChange={e => props.setConfirmPassword(e.target.value)}
            />
        </>
    )
}
