import React from 'react';


export default (props) => {
    return (
        <div className='d-flex justify-content-between'>
            {
                props.formType === 'login'
                ? 
                    <span>
                        <button type='submit' className='btn btn-primary'>Sign In</button>
                        <span className='mb-2 mx-2 mr-sm-2'>New to this app?
                            <span className='btn btn-link' onClick={() => props.setFormType('signup')}>Sign up</span>
                        </span>
                    </span>
                    
                :
                    <span>
                        <button type='submit' className='btn btn-primary'>Sign Up</button>
                        <span className='mb-2 mx-2 mr-sm-2'>Already a user?
                            <span className='btn btn-link' onClick={() => props.setFormType('login')}>Sign In</span>
                        </span>
                    </span>
            }
        </div>
    )
}