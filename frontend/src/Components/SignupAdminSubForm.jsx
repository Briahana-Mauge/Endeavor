import React from 'react';

export default function SignupAdminSubForm(props) {
    return (
        <>
            <div className='col-sm-6'>
                <input 
                    type='text' 
                    className='form-control mb-2' 
                    placeholder='Enter new password'
                    value={props.newPassword}
                    onChange={e => props.setNewPassword(e.target.value)}
                    />
            </div>
        </>
    )
}