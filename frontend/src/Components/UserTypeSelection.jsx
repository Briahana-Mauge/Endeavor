import React from 'react';

export default function UserTypeSelection(props) {
    return (
        <>
            <div className='col-12 d-flex flex-wrap justify-content-between'>
                <div className='form-group form-check'>
                    <label className='form-check-label'>
                        <input 
                            className='form-check-input' 
                            type='radio' 
                            name='userType'
                            value={props.userType}
                            onChange={() => props.setUserType('admin')}
                        /> Admin
                    </label>
                </div>
                
                <div className='form-group form-check'>
                    <label className='form-check-label'>
                        <input 
                            className='form-check-input' 
                            type='radio' 
                            name='userType'
                            value={props.userType}
                            onChange={() => props.setUserType('volunteer')}
                        /> Volunteer
                    </label>
                </div>

                <div className='form-group form-check'>
                    <label className='form-check-label'>
                        <input 
                            className='form-check-input' 
                            type='radio' 
                            name='userType'
                            value={props.userType}
                            onChange={() => props.setUserType('fellow')}
                        /> Fellow
                    </label>
                </div>
            </div>
        </>
    )
}