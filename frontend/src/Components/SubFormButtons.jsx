import React from 'react';


export default (props) => {
    return (
        <div>
            {
                props.formType === 'login'
                ? 
                    <span className='d-flex justify-content-between'>
                        <button type='submit' className='btn btn-primary'>Sign In</button>
                        <span className='mb-2 mx-2 mr-sm-2'>New to this app?
                            <span className='btn btn-link' onClick={() => props.setFormType('signup')}>Sign up</span>
                        </span>
                    </span>
                    
                :
                    <>
                        <span className='d-flex justify-content-between'>
                            <button type='submit' className='btn btn-primary'>Sign Up</button>
                            <span className='mb-2 mx-2 mr-sm-2'>Already a user?
                                <span className='btn btn-link' onClick={() => props.setFormType('login')}>Sign In</span>
                            </span>
                        </span>

                        <div className='d-flex justify-content-between'>
                            <div className='form-group form-check'>
                                <label className='form-check-label'>
                                    <input className='form-check-input' type='checkbox' /> Admin Account
                                </label>
                            </div>
                            <div className='form-group form-check'>
                                <label className='form-check-label'>
                                    <input className='form-check-input' type='checkbox' /> Volunteer Account
                                </label>
                            </div>
                            <div className='form-group form-check'>
                                <label className='form-check-label'>
                                    <input className='form-check-input' type='checkbox' /> Fellow Account
                                </label>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}