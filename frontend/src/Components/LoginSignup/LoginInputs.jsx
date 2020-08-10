import React from 'react';

export default function LoginInputs(props) {
    const isLogin = (props.formType === 'login');
    const isPursuitSignup = (props.formType === 'signup') && (props.userType !== 'volunteer');

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
            {   // No password input for new volunteer
                isLogin || (isPursuitSignup && props.userType !== '') // hidden initially when no usertype selected yet
                    ?   <>
                            <label htmlFor="passwordTxt" className="g1TxtLabel">
                                {
                                    isLogin
                                        ? 'Password'
                                        : 'Given Password'
                                }
                            </label>
                            <input
                                type='password'
                                id='passwordTxt'
                                className='form-control'
                                placeholder={
                                    isLogin
                                        ? ''
                                        : 'Enter one-time password'
                                }
                                value={props.password}
                                onChange={e => props.setPassword(e.target.value)}
                            />
                        </>
                    :   null
            }
        </>
    )
}
