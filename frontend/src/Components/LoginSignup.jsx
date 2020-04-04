import React, { useState } from 'react';

import SubFormButtons from './SubFormButtons';


export default (props) => {
    const [ formType, setFormType ] = useState('login');

    return (
        <div> 
            <img className='d-block mx-auto appLogo' src='/images/app_logo.jpg' alt='app logo'/>
            
            <form >
                <div className='form-group'>
                    <label htmlFor='email'>Email address:</label>
                    <input type='email' className='form-control' placeholder='Enter email' id='email' />
                </div>

                <div className='form-group'>
                    <label htmlFor='pwd'>Password:</label>
                    <input type='password' className='form-control' placeholder='Enter password' id='pwd' />
                </div>


                signin form 

                <SubFormButtons formType={formType} setFormType={setFormType} />

            </form>
        </div>
    )
}