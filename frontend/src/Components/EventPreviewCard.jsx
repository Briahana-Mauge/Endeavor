import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function EventPreviewCard(props) {
    const { event, loggedUser, setShowEvent, targetEvent, setTargetEvent } = props;

    const [volunteersList, setVolunteersList] = useState([]);
    const [acceptedVolunteers, setAcceptedVolunteers] = useState([]);
    const [loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent] = useState(false);
    const [loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted] = useState(false);


    const mapVolunteersList = () => {
        let found = false;
        let accepted = false;
        const accVolunteers = [];
        const volList = [];

        for (let volunteer of event.volunteers_list) {
            if (volunteer && volunteer.volunteerId) { // IN PSQL when there is no mach for an ARRAY_AGG, instead of having [], we get [null]
                if (loggedUser && loggedUser.v_id && loggedUser.v_id === volunteer.volunteerId) {
                    found = true;
                    if (volunteer.confirmedToEvent) {
                        accepted = true
                    }
                }
                if (volunteer.confirmedToEvent) {
                    accVolunteers.push(volunteer.volunteerId); // push the id of the volunteer
                }
                volList.push(volunteer);
            }
        }
        volList.sort((a, b) => a.volunteerId - b.volunteerId);

        setLoggedVolunteerPartOfEvent(found);
        setLoggedVolunteerRequestAccepted(accepted);
        setAcceptedVolunteers(accVolunteers);
        setVolunteersList(volList);
    }
    useEffect(mapVolunteersList, [loggedUser, event]);


    // const setEventAsTarget = useCallback(() => {
    //     const eventDataObj = Object.assign({}, event, {
    //         volunteersList,
    //         loggedVolunteerPartOfEvent,
    //         loggedVolunteerRequestAccepted,
    //         acceptedVolunteers
    //     });
    //     setTargetEvent(eventDataObj);
    // }, [
    //     acceptedVolunteers,
    //     event,
    //     loggedVolunteerPartOfEvent,
    //     loggedVolunteerRequestAccepted,
    //     setTargetEvent,
    //     volunteersList
    // ]);

    // useEffect(() => {
    //     if (targetEvent.event_id && targetEvent.event_id === event.event_id) {
    //         setEventAsTarget();
    //     }
    // }, [event, volunteersList, targetEvent.event_id, setEventAsTarget]);


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

    return (
        <div className='col-12 col-sm-6 col-lg-4 col-xl-3 p-2'>
            <div className='border rounded-lg p-2'>
                <header
                    className='text-center font-weight-bolder'
                    // onClick={handleClickOnEvent}
                    // data-toggle="modal"
                    // data-target="#primaryModal"
                >
                    <Link to={`/event/${event.event_id}`} className='plainLink'>{event.topic}</Link>
                </header>
                {/* <div className='text-right' style={{ color: '#666'}}>{`id# ${event.event_id}`}</div> */}
                {
                    eventStart[0] === eventEnd[0]
                        ? eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                            ? <p>{eventStart[0]}</p>
                            : <p>{eventStart[0]} {eventStart[1]} to {eventEnd[1]}</p>
                        : eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                            ? <p>{eventStart[0]} to {eventEnd[0]}</p>
                            : <p>{eventStart[0]} {eventStart[1]} to {eventEnd[0]} {eventEnd[1]}</p>
                }
                <p><strong>Host: </strong>{event.instructor}</p>
                <p><strong>For: </strong>{event.cohort}</p>

                {
                    /* If location is a link for google meet or zoom, create a link for the location to open in a new tab
                    If not, leave the location as plan text */

                    event.location.slice(0, 7).toLowerCase() === 'zoom.us' || event.location.slice(0, 11).toLowerCase() === 'meet.google'
                        ? <p><strong>Location: </strong><a href={"http://" + event.location} target="_blank" rel="noopener noreferrer">{event.location}</a></p>
                        : event.location.slice(0, 4).toLowerCase() === 'http'
                            ? <p><strong>Location: </strong><a href={event.location} target="_blank" rel="noopener noreferrer">{event.location}</a></p>
                            : <p><strong>Location: </strong>{event.location}</p>

                }

                {
                    loggedUser && loggedUser.a_id
                        ? <p>
                            <strong>Volunteers: </strong>{acceptedVolunteers.length + ' / ' + event.number_of_volunteers + ' '}
                            {
                                volunteersList.length - acceptedVolunteers.length
                                    ? <span className='text-warning'> ({volunteersList.length - acceptedVolunteers.length} pending)</span>
                                    : null
                            }
                        </p>
                        : null
                }
                {
                    loggedUser && loggedUser.v_id && loggedVolunteerPartOfEvent
                        ? loggedVolunteerRequestAccepted
                            ? <strong>I'm part of this event</strong>
                            : <strong>Request pending</strong>
                        : null
                }
            </div>
        </div>
    )
}