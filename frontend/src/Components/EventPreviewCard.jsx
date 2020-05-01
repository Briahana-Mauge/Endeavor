import React, { useState, useEffect } from 'react';


export default function EventPreviewCard(props) {
    const { loggedUser, event } = props;
    /* 
        props.event.volunteers_list is an array of STRING 
        where reach element is all one volunteer information related to that event separated by ,
        if split(' &$%& ') we will have:
            index0: volunteer ID
            index1: first and last name
            index2: email
            index3: volunteer profile deleted
            index4: event_volunteers table id
            index5: volunteer confirmed to event

        ' &$%& ' was used to be as far as possible from common combinations entered by users
        for instance if ', ' was selected, a user could have a middle name and entre name, middle name initial in the first name field
        which will break the code since all next data will be shifted
    */

    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ acceptedVolunteers, setAcceptedVolunteers] = useState([]);


    const mapVolunteersList = () => {
        let found = false;
        let accepted = false;
        const accVolunteers = [];
        const volList = [];

        if (event.volunteers_list[0]) { // IN PSQL when there is no mach for an ARRAY_AGG, instead of having [], we get [null]
            for (let volunteer of event.volunteers_list) {
                const volunteerInfo = volunteer.split(' &$%& ');
                if (loggedUser && loggedUser.v_id && loggedUser.v_id === parseInt(volunteerInfo[0])) { 
                    found = true;
                    if (volunteerInfo[5] === 'true') {
                        accepted = true
                    }
                }
                if (volunteerInfo[5] === 'true') {
                    accVolunteers.push(parseInt(volunteerInfo[0])); // push the id of the volunteer
                }
                volList.push(volunteerInfo);
            }
        }
        volList.sort((a, b) => a[0]-b[0]);

        setLoggedVolunteerPartOfEvent(found);
        setLoggedVolunteerRequestAccepted(accepted);
        setAcceptedVolunteers(accVolunteers);
        setVolunteersList(volList);
    }
    useEffect(mapVolunteersList, [loggedUser, event]);


    const setEventAsTarget = () => {
        const eventDataObj = Object.assign({}, event, {
            volunteersList,
            loggedVolunteerPartOfEvent,
            loggedVolunteerRequestAccepted,
            acceptedVolunteers
        });
        props.setTargetEvent(eventDataObj);
    }

    useEffect(() => {
        if (props.targetEvent.event_id && props.targetEvent.event_id === event.event_id) {
            setEventAsTarget();
        }
    }, [event, volunteersList]);

    
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
                <p><strong>Location: </strong>{event.location}</p>
                {
                    loggedUser && loggedUser.a_id
                    ?   <p>
                            <strong>Volunteers: </strong>{acceptedVolunteers.length + ' / ' + event.number_of_volunteers}
                            {
                                event.volunteers_list[0] && event.volunteers_list.length - acceptedVolunteers.length
                                ? <span className='text-warning'> ({event.volunteers_list.length - acceptedVolunteers.length} pending)</span>
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