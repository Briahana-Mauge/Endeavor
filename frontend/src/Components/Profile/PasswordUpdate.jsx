import React from 'react';

export default function PasswordUpdate(props) {
    return (
        <>

            <label htmlFor="emailTxt" className="g1TxtLabel mb-4">Current password
                <input 
                    type='password' 
                    className='form-control'
                    placeholder=''
                    value={props.password}
                    onChange={e => props.setPassword(e.target.value)}
                />
            </label>

            <label htmlFor="emailTxt" className="g1TxtLabel">New password
                <input 
                    className='form-control'
                    type='password' 
                    placeholder=''
                    value={props.newPassword}
                    onChange={e => props.setNewPassword(e.target.value)}
                />
            </label>

            <label htmlFor="emailTxt" className="g1TxtLabel">Confirm new password
                <input 
                    type='password' 
                    className='form-control'
                    placeholder=''
                    value={props.confirmPassword}
                    onChange={e => props.setConfirmPassword(e.target.value)}
                />
            </label>

        </>
    )
}