/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// import VolunteerPreviewCard from './VolunteerPreviewCard';
import EventPreviewCard from '../EventPreviewCard';
import EventsCard from '../EventCard';

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;
    const [eventsList, setEventsList] = useState([]);
    const [showEvent, setShowEvent] = useState(false);
    const [showVolunteeredTime, setShowVolunteeredTime] = useState(0);
    const [showPastEvents, setShowPastEvents] = useState('')
    const [showImportantEvents, setShowImportantEvents] = useState([]);
    const [targetEvent, setTargetEvent] = useState({});
    const [reload, setReload] = useState(false);


    useEffect(() => {
        const getEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/upcoming/volunteer/${props.loggedUser.v_id}`);
                let first3 = [];
                for (let i = 0; i < Math.min(3, data.payload.length); i++) {
                    first3.push(data.payload[i])
                }
                setEventsList(first3);
            } catch (err) {
                setFeedback(err)
            }
        }

        getEvents();
    }, [reload]);

    useEffect(() => {

        const getAllVolunteeredTime = async () => {
            try {
                const { data } = await axios.get(`/api/time/hours/${props.loggedUser.v_id}`);
                setShowVolunteeredTime(data.payload.sum)

            } catch (err) {
                setFeedback(err)
            }
        }

        const getNumberOfPastEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/past/volunteer/${props.loggedUser.v_id}`);
                setShowPastEvents(data.payload.length)
            } catch (err) {
                setFeedback(err)
            }
        }
        const getImportantEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/important`);
                console.log(data)
                let first3 = [];
                for (let i = 0; i < Math.min(3, data.payload.length); i++) {
                    first3.push(data.payload[i])
                }
                setShowImportantEvents(first3)
            } catch (err) {
                setFeedback(err)
            }
        }

        getAllVolunteeredTime();
        getNumberOfPastEvents();
        getImportantEvents();
    }, []);


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
            {eventsList.length === 0 ?
                <><p>You are not registered to volunteer at any upcoming events.</p>
                    <p> Visit the Events page to find out more!</p></>
                : null}

            {
                eventsList.map(event => <EventPreviewCard
                    key={event.event_id + event.event_end + event.event_start}
                    event={event}
                    displayEvent={displayEvent}
                    loggedUser={props.loggedUser}
                    setTargetEvent={setTargetEvent}
                    setShowEvent={setShowEvent}
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
            <br></br>
            <br></br>
            <h3>Important Pursuit Events</h3>
            {
                showImportantEvents.map(event => <EventPreviewCard
                    key={event.event_id + event.event_end + event.event_start}
                    event={event}
                    displayEvent={displayEvent}
                    loggedUser={props.loggedUser}
                    setTargetEvent={setTargetEvent}
                    setShowEvent={setShowEvent}
                />)
            }

            <br></br>
            <br></br>
            <h3>Personal Stats</h3>
            <p>
                You've got {showVolunteeredTime} volunteer hours!
            </p>

            {
                showPastEvents < 1
                    ? <p>You haven't participated in any events yet.</p>
                    : showPastEvents > 1
                        ? <p>So far, you've participated in {showPastEvents} events.</p>
                        : <p>So far, you've participated in {showPastEvents} event.</p>
            }



        </>

    )
}

export default Dashboard;