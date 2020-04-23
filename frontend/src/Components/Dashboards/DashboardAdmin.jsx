/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerPreviewCard from '../VolunteerPreviewCard';
import EventPreviewCard from '../EventPreviewCard';
import EventCard from '../EventCard';

const DashboardAdmin = (props) => {
    const { setFeedback, loggedUser } = props;

    const [ newVolunteersList, setNewVolunteersList ] = useState([]);
    const [ eventsList, setEventsList ] = useState([]);
    const [ showEvent, setShowEvent ] = useState(false);
    const [ targetEvent, setTargetEvent ] = useState({});
    const [ reloadDashboard, setReloadDashboard ] = useState(false);


    useEffect(() => {
        const getNewVolunteer = async () => {
            try {
                const {data} = await axios.get('/api/volunteers/new');
                setNewVolunteersList(data.payload);
            } catch (err) {
                setFeedback(err)
            }
        }

        getNewVolunteer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadDashboard]);

    useEffect(() => {
        const getEvents = async () => {
            try {
                const {data} = await axios.get('/api/events/admin/all?upcoming=true');
                setEventsList(data.payload);
            } catch (err) {
                setFeedback(err)
            }
        }

        getEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadDashboard]);


    const acceptVolunteer = async (id) => {
        try {
            await axios.patch(`/api/volunteers/confirm/${id}`);
            setReloadDashboard(!reloadDashboard);
        } catch (err) {
            setFeedback(err)
        }
    }

    const hideEvent = () => {
        setTargetEvent({});
        setShowEvent(false);
    }


    return (
        <>
            <h3>New Volunteers:</h3>
            <div className='d-flex flex-row'>
                {
                    newVolunteersList.map(volunteer => <div key={volunteer.v_first_name+volunteer.v_last_name_volunteer_id} >
                        <VolunteerPreviewCard volunteer={volunteer} acceptVolunteer={acceptVolunteer}/>
                    </div>)
                }
            </div>

            <hr />
            <h3>Upcoming Events:</h3>
            <div className='d-flex flex-wrap'>
                {
                    eventsList.map(event => <EventPreviewCard 
                            key={event.event_id + event.event_end + event.event_start}
                            loggedUser={loggedUser}
                            event={event}
                            setShowEvent={setShowEvent}
                            setFeedback={setFeedback}
                            setTargetEvent={setTargetEvent}
                        />)
                }
            </div>

            {
                showEvent 
                ?   <div className='lightBox'>
                        <EventCard 
                            loggedUser={loggedUser} 
                            event={targetEvent}
                            setFeedback={setFeedback}
                            reloadParent={reloadDashboard}
                            setReloadParent={setReloadDashboard}
                            hideEvent={hideEvent}
                        />
                    </div>
                : null
            }
        </>
    )
}

export default DashboardAdmin;
