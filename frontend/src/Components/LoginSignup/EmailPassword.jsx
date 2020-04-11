import React from 'react';

export default function EmailPassword(props) {
    return (
        <>
            <div className='col-sm-6'>
                <input 
                    className='form-control mb-2' 
                    type='email' 
                    placeholder='Enter email' 
                    value={props.email}
                    onChange={e => props.setEmail(e.target.value)}
                />
            </div>

            <div className='col-sm-6'>
                <input 
                    type='password' 
                    className='form-control mb-2' 
                    placeholder={
                        props.formType === 'signup' && (props.userType === 'admin' || props.userType === 'fellow') 
                        ? 'Enter default password proved by your Admin' 
                        : 'Enter password'
                    } 
                    value={props.password}
                    onChange={e => props.setPassword(e.target.value)}
                />
            </div>
        </>
    )
}