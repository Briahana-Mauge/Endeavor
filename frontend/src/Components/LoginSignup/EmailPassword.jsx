import React from 'react';

export default function EmailPassword(props) {
    return (
        <div className='g1-landing__auth container col-11'>
            <h2 className="g1-landing-mode--login">Log In</h2>
            <div className="g1-auth__inputs">
                <label htmlFor="emailTxt">Email address</label>
                <input 
                    className='form-control'
                    type='email'
                    id='emailTxt'
                    placeholder=''
                    value={props.email}
                    onChange={e => props.setEmail(e.target.value)}
                />
                <label htmlFor="passwordTxt">Password</label>
                <input 
                    type='password'
                    id='passwordTxt'
                    className='form-control mb-2'
                    placeholder={
                        props.formType === 'signup' && (props.userType === 'admin' || props.userType === 'fellow') 
                        ? 'Enter default password proved by your Admin' 
                        : ''
                    } 
                    value={props.password}
                    onChange={e => props.setPassword(e.target.value)}
                />
                <button type='submit' className='btn btn-primary g1-btn--submit'>Log In</button>
            </div>
        </div>
    )
}