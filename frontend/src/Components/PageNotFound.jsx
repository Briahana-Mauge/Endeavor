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
        <div className='notFoundPage'>
            <div className='d-flex justify-content-around'>
                <button className='btn btn-link plainLink' onClick={e => {history.goBack(); history.goBack()}}>Back</button>
                <button className='btn btn-link plainLink' onClick={e => history.replace('/')}>Home</button>
            </div>
        </div>
    )
}