import React from 'react';

export default function LoginInputs(props) {
    return (
        <>
            <label htmlFor="emailTxt" className="g1TxtLabel">Email address</label>
            <input 
                className='form-control'
                type='email'
                id='emailTxt'
                placeholder=''
                value={props.email}
                onChange={e => props.setEmail(e.target.value)}
            />
            <label htmlFor="passwordTxt" className="g1TxtLabel">Password</label>
            <input 
                type='password'
                id='passwordTxt'
                className='form-control mb-2'
                placeholder={
                    props.formType === 'signup' && (props.userType === 'admin' || props.userType === 'fellow') 
                    ? 'Enter the default password you were provided' 
                    : ''
                } 
                value={props.password}
                onChange={e => props.setPassword(e.target.value)}
            />
        </>
    )
}