import React from 'react';

export default function LoginInputs(props) {
    const isSignup = (props.formType === 'signup');
    const isVolunteerSignup = (props.formType === 'signup') && (props.userType === 'volunteer');

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
                isVolunteerSignup || props.userType === ''
                    ?   null
                    :   <>
                            <label htmlFor="passwordTxt" className="g1TxtLabel">
                                {
                                    isSignup
                                        ? 'Given Password'
                                        : 'Password'
                                }
                            </label>
                            <input
                                type='password'
                                id='passwordTxt'
                                className='form-control'
                                placeholder={
                                    isSignup
                                        ? 'Enter one-time password'
                                        : ''
                                }
                                value={props.password}
                                onChange={e => props.setPassword(e.target.value)}
                            />
                        </>
            }
        </>
    )
}
