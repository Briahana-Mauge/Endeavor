import React from 'react';

export default function UserTypeSelection(props) {
    return (
        <>
            <div className='g1UsertypeSelect'>
                Are you a Pursuit Fellow or Staff member?

                <div className='form-check'>
                    <label className='form-check-label'>
                        <input 
                            className='form-check-input' 
                            type='radio' 
                            name='userType'
                            value={props.userType}
                            onChange={() => props.setUserType('fellow')}
                        />
                        Yes, Fellow!
                    </label>
                </div>

                <div className='form-check'>
                    <label className='form-check-label'>
                        <input 
                            className='form-check-input' 
                            type='radio' 
                            name='userType'
                            value={props.userType}
                            onChange={() => props.setUserType('admin')}
                        />
                        Yes, Staff!
                    </label>
                </div>

                <div className='form-check'>
                    <label className='form-check-label'>
                        <input 
                            className='form-check-input' 
                            type='radio' 
                            name='userType'
                            value={props.userType}
                            onChange={() => props.setUserType('volunteer')}
                        />
                        No, I want to become a Volunteer!
                    </label>
                </div>

            </div>
        </>
    )
}