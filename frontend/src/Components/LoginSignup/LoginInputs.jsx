import React from 'react';

export default function LoginInputs(props) {
    const isSignup = (props.formType === 'signup');
    const isPursuitSignup = (props.formType === 'signup') && (props.userType === 'admin' || props.userType === 'fellow');

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
            <label htmlFor="passwordTxt" className="g1TxtLabel">
                {
                    isSignup
                        ? isPursuitSignup
                            ? 'Given Password'
                            : 'New Password'
                        : 'Password'
                }
            </label>
            <input 
                type='password'
                id='passwordTxt'
                className='form-control'
                placeholder={
                    isPursuitSignup
                        ? 'Enter one-time password'
                        : ''
                }
                value={props.password}
                onChange={e => props.setPassword(e.target.value)}
            />
        </>
    )
}