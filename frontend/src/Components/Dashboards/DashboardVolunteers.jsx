/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EventPreviewCard from '../EventPreviewCard';
import EventCard from '../EventCard';

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;

    const [eventsList, setEventsList] = useState([]);
    const [showEvent, setShowEvent] = useState(false);
    const [volunteeredTime, setVolunteeredTime] = useState(0);
    const [pastEvents, setPastEvents] = useState(0);
    const [importantEvents, setImportantEvents] = useState([]);
    const [targetEvent, setTargetEvent] = useState({});
    const [reloadDashboard, setReloadDashboard] = useState(false);


    useEffect(() => {
        const getEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/upcoming/volunteer/${props.loggedUser.v_id}?limit=3`);
                setEventsList(data.payload);
            } catch (err) {
                setFeedback(err)
            }
        }

        const getImportantEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/important?limit=3`);
                setImportantEvents(data.payload);

            } catch (err) {
                setFeedback(err)
            }
        }

        getEvents();
        getImportantEvents();
    }, [reloadDashboard]);

    useEffect(() => {
        const getAllVolunteeredTime = async () => {
            try {
                const { data } = await axios.get(`/api/time/hours/${props.loggedUser.v_id}`);
                setVolunteeredTime(data.payload.sum)

            } catch (err) {
                setFeedback(err)
            }
        }

        const getNumberOfPastEvents = async () => {
            try {
                const { data } = await axios.get(`/api/events/past/volunteer/${props.loggedUser.v_id}`);
                setPastEvents(data.payload.length)
            } catch (err) {
                setFeedback(err)
            }
        }

        getAllVolunteeredTime();
        getNumberOfPastEvents();
    }, []);


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
                    key={event.event_id + event.event_start + event.event_end}
                    loggedUser={loggedUser}
                    event={event}
                    setShowEvent={setShowEvent}
                    targetEvent={targetEvent}
                    setTargetEvent={setTargetEvent}
                />)
            }

            {
                showEvent 
                ?   <EventCard 
                        loggedUser={loggedUser} 
                        event={targetEvent}
                        setFeedback={setFeedback}
                        reloadParent={reloadDashboard}
                        setReloadParent={setReloadDashboard}
                        hideEvent={hideEvent}
                    />
                : null
            }
            <br></br>
            <br></br>
            <h3>Important Pursuit Events</h3>
            {
                importantEvents.map(event => <EventPreviewCard
                    key={event.event_end + event.event_start + event.event_id}
                    loggedUser={loggedUser}
                    event={event}
                    setShowEvent={setShowEvent}
                    targetEvent={targetEvent}
                    setTargetEvent={setTargetEvent}
                />)
            }

            <br></br>
            <br></br>
            <h3>Personal Stats</h3>
            <p>
                You've got {volunteeredTime} volunteer hours!
            </p>

            {
                pastEvents < 1
                    ? <p>You haven't participated in any events yet.</p>
                    : pastEvents > 1
                        ? <p>So far, you've participated in {pastEvents} events.</p>
                        : <p>So far, you've participated in {pastEvents} event.</p>
            }



        </>

    )
}

export default Dashboard;