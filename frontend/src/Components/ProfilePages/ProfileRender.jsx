import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import VolunteerProfilePage from './VolunteerProfilePage';
import FellowProfilePage from './FellowProfilePage';

export default function ProfileRender(props) {
    const { volunteerId, fellowId } = useParams();
    
    const [ pageForm, setPageForm ] = useState('lightBox');

    useEffect(() => {
        if (volunteerId || fellowId) {
            setPageForm('container');
        } else {
            setPageForm('lightBox'); // To be styled with CSS to be a lightbox on top of another page
        }
    }, [volunteerId, fellowId]);

    return (
        <div className={pageForm}>
            {
                pageForm === 'lightBox'
                ?   <div className='text-right m-2 closeButton'>
                        <button className='btn-sm btn-danger' onClick={props.hideProfile}>X</button>
                    </div>
                : null
            }

            {
                volunteerId || props.volunteerId
                ?   <VolunteerProfilePage 
                        volunteerId={volunteerId || props.volunteerId} 
                        setFeedback={props.setFeedback}
                        loggedUser={props.loggedUser}
                    />
                : null
            }

            {
                fellowId || props.fellowId
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
