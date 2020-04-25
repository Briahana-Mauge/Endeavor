/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// import VolunteerPreviewCard from './VolunteerPreviewCard';
import EventPreviewCard from '../EventPreviewCard';
import EventsCard from '../EventsCard';

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;
    const [eventsList, setEventsList] = useState([]);
    const [showEvent, setShowEvent] = useState(false);
    const [targetEvent, setTargetEvent] = useState({});
    const [reload, setReload] = useState(false);


    useEffect(() => {
        const getEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/upcoming/volunteer/${props.loggedUser.v_id}`);
                console.log(data)
                let first3 = [];
                for (let i = 0; i < 3; i++) {
                    if (data.payload[i]) {
                        first3.push(data.payload[i])
                        console.log(first3)
                    }
                }
                setEventsList(first3);
            } catch (err) {
                setFeedback(err)
            }
        }

        getEvents();
    }, [reload]);

    const displayEvent = (event) => {
        setTargetEvent(event);
        setShowEvent(true);
    }

    const hideEvent = () => {
        setTargetEvent({});
        setShowEvent(false);
    }



    return (
        <>
            <h3>Upcoming Events:</h3>
            {
                eventsList.map(event => <EventPreviewCard
                    key={event.event_id + event.event_end + event.event_start}
                    event={event}
                    displayEvent={displayEvent}
                    loggedUser={props.loggedUser}
                />)
            }

            {
                showEvent
                    ? <div className='lightBox'>
                        <div className='text-right m-2'>
                            <button className='btn-sm btn-danger' onClick={hideEvent}>X</button>
                        </div>
                        <EventsCard
                            loggedUser={loggedUser}
                            event={targetEvent}
                            setFeedback={setFeedback}
                            reload={reload}
                            setReload={setReload}

                        />
                    </div>
                    : null
            }
        </>
    )
}

export default Dashboard;