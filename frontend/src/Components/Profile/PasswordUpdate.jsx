import React from 'react';

export default function PasswordUpdate(props) {
    return (
        <>
            <div className='col-sm-6'>
                <input 
                    className='form-control mb-2' 
                    type='password' 
                    placeholder='Enter new password' 
                    value={props.newPassword}
                    onChange={e => props.setNewPassword(e.target.value)}
                />
            </div>

            <div className='col-sm-6'>
                <input 
                    type='password' 
                    className='form-control mb-2' 
                    placeholder='Confirm new password'
                    value={props.confirmPassword}
                    onChange={e => props.setConfirmPassword(e.target.value)}
                />
            </div>

            <div className='col-sm-6'>
                <input 
                    type='password' 
                    className='form-control mb-2' 
                    placeholder='Old password'
                    value={props.password}
                    onChange={e => props.setPassword(e.target.value)}
                />
            </div>

        </>
    )
}