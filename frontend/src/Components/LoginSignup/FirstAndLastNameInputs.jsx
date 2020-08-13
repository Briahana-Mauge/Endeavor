import React from 'react';

export default function FirstAndLastNameInputs(props) {
    return (
        <>
            <label htmlFor="fnameTxt" className="g1TxtLabel">First name
                <input
                    type='text'
                    id='fnameTxt'
                    className='form-control'
                    placeholder=''
                    value={props.firstName}
                    onChange={e => props.setFirstName(e.target.value)}
                />
            </label>

            <label htmlFor="lnameTxt" className="g1TxtLabel">Last name
                <input
                    type='text'
                    id='lnameTxt'
                    className='form-control'
                    placeholder=''
                    value={props.lastName}
                    onChange={e => props.setLastName(e.target.value)}
                />
            </label>
        </>
    )
}
