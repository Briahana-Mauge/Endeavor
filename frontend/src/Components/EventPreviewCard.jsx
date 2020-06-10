import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EventPreviewCard(props) {
    const { event, loggedUser, isEventSearchGrided } = props;

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
                    {
                        /* If location is a link for google meet or zoom, create a link for the location to open in a new tab
                        If not, leave the location as plan text */

                        event.location.slice(0, 7).toLowerCase() === 'zoom.us' || event.location.slice(0, 11).toLowerCase() === 'meet.google'
                            ? <a href={"http://" + event.location} target="_blank" rel="noopener noreferrer">{event.location}</a>
                            : event.location.slice(0, 4).toLowerCase() === 'http'
                                ? <a href={event.location} target="_blank" rel="noopener noreferrer">{event.location}</a>
                                : <>{event.location}</>
                    }
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
                                        {volunteersList.length - acceptedVolunteers.length > 0
                                            ? <div className='g1EvResultCard__VolsPending'>{volunteersList.length - acceptedVolunteers.length} pending</div>
                                            : null
                                        }
                                    </>
                                :   <>
                                        <div>
                                            <i>{acceptedVolunteers.length} confirmed</i>, <br />
                                            <span>{event.number_of_volunteers} requested</span><br />
                                            {volunteersList.length - acceptedVolunteers.length > 0
                                                ? <span className='g1EvResultCard__VolsPending'>≫ {volunteersList.length - acceptedVolunteers.length} pending</span>
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