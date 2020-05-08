import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import VolunteerProfilePage from './VolunteerProfilePage';
import FellowProfilePage from './FellowProfilePage';

export default function ProfileRender(props) {
    const { volunteerId, fellowId } = useParams();
    const originPath = useLocation().pathname.split('/')[1];
    
    const [ pageForm, setPageForm ] = useState('');

    useEffect(() => {
        if ((originPath === 'volunteer' && volunteerId) 
            || (originPath === 'fellow' && fellowId)) {
            setPageForm('');
        } else {
            setPageForm('lightBox'); // To be styled with CSS to be a lightbox on top of another page
        }
    }, [originPath, volunteerId, fellowId]);

    return (
        <div className={pageForm}>
            {
                pageForm === 'lightBox'
                ?   <div className='text-right m-2 closeButton'>
                        <button className='btn-sm btn-danger' onClick={e => props.setDisplayTargetUser(false)}>X</button>
                    </div>
                : null
            }

            {
                (originPath === 'volunteer' && volunteerId) || props.volunteerId
                ?   <VolunteerProfilePage 
                        volunteerId={volunteerId || props.volunteerId} 
                        setFeedback={props.setFeedback}
                        loggedUser={props.loggedUser}
                    />
                : null
            }

            {
                (originPath === 'fellow' && fellowId) || props.fellowId
                ?   <FellowProfilePage 
                        fellowId={fellowId || props.fellowId} 
                        setFeedback={props.setFeedback}
                        loggedUser={props.loggedUser}
                    />
                : null
            }
        </div>
    )
}
