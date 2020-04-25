import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function EventPreviewCard(props) {
    const { setFeedback, loggedUser, event } = props; 

    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ volunteersEmailList, setVolunteersEmailList] = useState('');
    const [ reload, setReload ] = useState(false);

    
    const getVolunteersList = () => {
        axios.get(`/api/event_attendees/volunteers/${event.event_id}`)
            .then(response => setVolunteersList(response.data.payload))
            .catch(err => setFeedback(err))
    }
    useEffect(getVolunteersList, [reload]);

    const checkIfVolunteerSignedForEvent = () => {
        let found = false;
        let accepted = false;
        let emailList = '';
        for (let volunteer of volunteersList) {
            if (loggedUser && loggedUser.v_id && loggedUser.v_id === volunteer.v_id) { 
                found = true;
                if (volunteer.volunteer_request_accepted) {
                    accepted = true
                }
            }
            if (volunteer.volunteer_request_accepted) {
                emailList += `&add=${volunteer.v_email}`
            }
        }
        setLoggedVolunteerPartOfEvent(found);
        setLoggedVolunteerRequestAccepted(accepted);
        setVolunteersEmailList(emailList);
    }
    useEffect(checkIfVolunteerSignedForEvent, [loggedUser, volunteersList]);

    const setEventAsTarget = () => {
        const eventDataObj = Object.assign({}, event, {
            volunteersList,
            loggedVolunteerPartOfEvent,
            loggedVolunteerRequestAccepted,
            volunteersEmailList,
            reload,
            setReload,
        });
        props.setTargetEvent(eventDataObj);
    }
    useEffect(setEventAsTarget, [loggedUser, volunteersList, loggedVolunteerPartOfEvent, loggedVolunteerRequestAccepted, volunteersEmailList]);

    const handleClickOnEvent = () => {
        setEventAsTarget();
        props.setShowEvent(true); 
    }
    
    const formatEventDate = date => {
        const d = new Date(date).toLocaleDateString();
        const t = new Date(date).toLocaleTimeString();
        return [d, `${t.slice(0, -6)} ${t.slice(-2)}`];
    }

    const eventStart = formatEventDate(event.event_start);
    const eventEnd = formatEventDate(event.event_end);

    return (
        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 p-2'>
            <div className='border rounded-lg p-2'>
                <header className='text-center font-weight-bolder' onClick={handleClickOnEvent}>{event.topic}</header>
                {
                    eventStart[0] === eventEnd[0]
                    ?   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                        ?   <p>{eventStart[0]}</p>
                        :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[1]}</p>
                    :   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                        ?   <p>{eventStart[0]} to {eventEnd[0]}</p>
                        :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[0]} {eventEnd[1]}</p>
                }
                <p><strong>Host: </strong>{event.instructor}</p>
                <p><strong>For: </strong>{event.cohort}</p>
                {
                    loggedUser && loggedUser.a_id
                    ?   <p>
                            <strong>Volunteers: </strong>{volunteersEmailList.split('&add=').length - 1 + ' / ' + event.number_of_volunteers}
                            {
                                volunteersList.length - volunteersEmailList.split('&add=').length + 1
                                ? <span className='text-warning'> ({volunteersList.length - volunteersEmailList.split('&add=').length + 1} pending)</span>
                                : null
                            }
                        </p>
                    :   null
                }
                {
                    loggedUser && loggedUser.v_id && loggedVolunteerPartOfEvent
                    ?   loggedVolunteerRequestAccepted
                        ?   <strong>I'm part of this event</strong>
                        :   <strong>Request pending</strong>
                    :   null
                }
            </div>
        </div>
    )
}