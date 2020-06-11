import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

import UIModule from '../UIModule';
import VolunteerProfilePage from './VolunteerProfilePage';
import FellowProfilePage from './FellowProfilePage';

export default function ProfileRender(props) {
    const { volunteerId, fellowId } = useParams();
    const originPath = useLocation().pathname.split('/')[1];

    return (
        <UIModule className='champagneCanvas' titleColor='' titleRegular=''>
            <div className='g1ModalDialog g1TempProfilePatch'>
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
        </UIModule>
    )
}
