import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import VolunteerProfilePage from './VolunteerProfilePage';

export default function ProfileRender(props) {
    const { volunteerId, fellowId } = useParams();
    console.log(volunteerId, fellowId)
    const [ pageForm, setPageForm ] = useState('lightBox');

    useEffect(() => {
        if (!volunteerId) {
            setPageForm('lightBox'); // To be styled with CSS to be a lightbox on top of another page
        } else {
            setPageForm('container');
        }
    }, [volunteerId]);

    return (
        <div className={pageForm}>
            {
                pageForm === 'lightBox'
                ?   <div className='text-right m-2'>
                        <button className='btn-sm btn-danger' onClick={props.hideProfile}>X</button>
                    </div>
                : null
            }
            <VolunteerProfilePage 
                volunteerId={volunteerId || props.volunteerId} 
                setFeedback={props.setFeedback}
                loggedUser={props.loggedUser}
            />
        </div>
    )
}