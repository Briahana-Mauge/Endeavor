/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
UI Module Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function PageNotFound() {
    const history = useHistory();

    return(
        <>
            <div className='d-flex justify-content-around'>
                <button className='btn btn-link' onClick={e => {history.goBack(); history.goBack()}}>Back</button>
                <button className='btn btn-link' onClick={e => history.replace('/')}>Home</button>
            </div>

            <h1 className='text-center'>We can have a message here or a 404 page</h1>
        </>
    )
}