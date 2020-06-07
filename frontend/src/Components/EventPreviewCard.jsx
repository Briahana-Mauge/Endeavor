import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';


export default function EventPreviewCard(props) {
    const { event, loggedUser, isEventSearchGrided, targetEvent, setTargetEvent } = props;

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

        if (event.volunteers_list && event.volunteers_list[0]) { // IN PSQL when there is no mach for an ARRAY_AGG, instead of having [], we get [null]
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


    const setEventAsTarget = useCallback(() => {
        const eventDataObj = Object.assign({}, event, {
            volunteersList,
            loggedVolunteerPartOfEvent,
            loggedVolunteerRequestAccepted,
            acceptedVolunteers
        });
        setTargetEvent(eventDataObj);
    }, [
        acceptedVolunteers,
        event,
        loggedVolunteerPartOfEvent,
        loggedVolunteerRequestAccepted,
        setTargetEvent,
        volunteersList
    ]);

    useEffect(() => {
        if (targetEvent.event_id && targetEvent.event_id === event.event_id) {
            setEventAsTarget();
        }
    }, [ event, volunteersList, targetEvent.event_id, setEventAsTarget ]);

    
    // const handleClickOnEvent = () => {
    //     setEventAsTarget();
    //     setShowEvent(true);
    // }
    
    const formatEventDate = date => {
        const d = new Date(date).toLocaleDateString();
        const t = new Date(date).toLocaleTimeString();
        return [d, `${t.slice(0, -6)} ${t.slice(-2)}`];
    }

    const eventStart = formatEventDate(event.event_start);
    const eventEnd = formatEventDate(event.event_end);

    // temporary visual functions to keep consistency with dashboard dates. eventually convert all dates to one handling system
    const simplifyDate = (dateString) => {
        if (dateString.slice(-5, -4) === '/') {
            return dateString.slice(0, -5);
        } else {
            return dateString;
        }
    }

    const simplifyHours = (timeString) => {
        if (timeString.slice(-2) === 'AM' || timeString.slice(-2) === 'PM') {
            return timeString.slice(0, -3) + timeString.slice(-2, -1).toLowerCase();
        } else {
            return timeString;
        }
    }

    return (
        <div className='g1EvResultCard px-1'>
            <div className='g1EvResultCard__Inner'>
                <Link to={`/event/${event.event_id}`} className='g1EvResultCard__TitleLink'>
                    <h5>
                        {event.topic}
                    </h5>
                    <div className='g1EvResultCard__DateTime'>
                        {
                            eventStart[0] === eventEnd[0]
                            ?   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                                ?   <>{simplifyDate(eventStart[0])}</>
                                :   <>{simplifyDate(eventStart[0])}, {simplifyHours(eventStart[1])} <span>-</span> {simplifyHours(eventEnd[1])}</>
                            :   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                                ?   <>{simplifyDate(eventStart[0])} <span>—</span> {simplifyDate(eventEnd[0])}</>
                                :   <>{simplifyDate(eventStart[0])}, {simplifyHours(eventStart[1])} <span>—</span> {simplifyDate(eventEnd[0])}, {simplifyHours(eventEnd[1])}</>
                        }
                    </div>
                </Link>
                <div className='g1EvResultCard__Hosts'>
                    <b>Host</b>
                    {event.instructor}
                </div>
                <div className='g1EvResultCard__Cohorts'>
                    <b>For</b>
                    {event.cohort}
                </div>
                <div className='g1EvResultCard__Location'>
                    <b>Location</b>
                    {event.location}
                </div>
                {
                    loggedUser && loggedUser.a_id
                    ?   <div className='g1EvResultCard__VolsCounts'>
                            <b>Volunteers</b>
                            {isEventSearchGrided
                                ?   <>
                                        <div>
                                            <i>{acceptedVolunteers.length} confirmed</i>
                                            <span>{' / ' + event.number_of_volunteers} requested</span>
                                        </div>
                                        {event.volunteers_list.length - acceptedVolunteers.length > 0
                                            ? <div className='g1EvResultCard__VolsPending'>{event.volunteers_list.length - acceptedVolunteers.length} pending</div>
                                            : null
                                        }
                                    </>
                                :   <>
                                        <div>
                                            <i>{acceptedVolunteers.length} confirmed</i>, <br />
                                            <span>{event.number_of_volunteers} requested</span><br />
                                            {event.volunteers_list.length - acceptedVolunteers.length > 0
                                                ? <span className='g1EvResultCard__VolsPending'>≫ {event.volunteers_list.length - acceptedVolunteers.length} pending</span>
                                                : null
                                            }
                                        </div>
                                    </>
                            }

                        </div>
                    :   null
                }
                {
                    loggedUser && loggedUser.v_id && loggedVolunteerPartOfEvent
                        ?   <>
                                { loggedVolunteerRequestAccepted
                                    ?   <div className='g1EvResultCard__VolStatus confirmed'>Participation CONFIRMED</div>
                                    :   <div className='g1EvResultCard__VolStatus'>Participation Pending</div>
                                }
                            </>
                        :   null
                }
                <div className='g1EvResultCard__BackgroundShift'></div>
            </div>
        </div>
    )
}