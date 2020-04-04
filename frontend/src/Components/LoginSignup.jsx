import React, { useState } from 'react';

import SubFormButtons from './SubFormButtons';


export default (props) => {
    const [ formType, setFormType ] = useState('login');

    return (
        <div> 
            <img className='d-block mx-auto appLogo' src='/images/app_logo.jpg' alt='app logo'/>
            
            <form className='form-inline'>
                <div className='form-group'>
                    <label className='mr-sm-2' htmlFor='email'>Email address:</label>
                    <input type='email' className='form-control mb-2 mr-sm-2' placeholder='Enter email' id='email' />
                </div>

                <div className='form-group'>
                    <label className='mr-sm-2' htmlFor='pwd'>Password:</label>
                    <input type='password' className='form-control mb-2 mr-sm-2' placeholder='Enter password' id='pwd' />
                </div>


                signin form 

                <SubFormButtons formType={formType} setFormType={setFormType} />

            </form>
        </div>
    )
}