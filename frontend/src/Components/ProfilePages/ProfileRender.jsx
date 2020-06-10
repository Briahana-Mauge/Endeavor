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
            setPageForm('g1ModalDialog g1TempProfilePatch');
        } else {
            setPageForm('lightBox'); // To be styled with CSS to be a lightbox on top of another page
        }
    }, [originPath, volunteerId, fellowId]);

    return (
        <div className={`${pageForm}`}>
            {
                (originPath === 'volunteer' && volunteerId)
                ?   <VolunteerProfilePage 
                        volunteerId={volunteerId} 
                        setFeedback={props.setFeedback}
                        loggedUser={props.loggedUser}
                    />
                : null
            }

            {
                (originPath === 'fellow' && fellowId)
                ?   <FellowProfilePage 
                        fellowId={fellowId} 
                        setFeedback={props.setFeedback}
                        loggedUser={props.loggedUser}
                    />
                : null
            }
        </div>
    )
}
