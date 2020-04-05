import React from 'react';

export default function FirstAndLastNameInputs(props) {
    return (
        <>
            <div className='col-sm-6'>
                <input 
                    type='text' 
                    className='form-control mb-2' 
                    placeholder='Enter first name' 
                    value={props.firstName}
                    onChange={e => props.setFirstName(e.target.value)}
                />
            </div>
            
            <div className='col-sm-6'>
                <input 
                    type='text' 
                    className='form-control mb-2' 
                    placeholder='Enter last name'
                    value={props.lastName}
                    onChange={e => props.setLastName(e.target.value)}
                />
            </div>
        </>
    )
}