import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { PMBody, PMFooter, PMFooterSpace } from './Modals/PrimaryModal';
const identifyUser = require('../helpers/identifyUser');


const EventCard = (props) => {
    const { setFeedback, loggedUser, event } = props;

    const [ volunteerHours, setVolunteerHours ] = useState({});
    const [ waitingForRender, setWaitingForRender ] = useState(false);
    const [ waitForRequest, setWaitForRequest ] = useState(0);

    const userIs = identifyUser(loggedUser);
    const history = useHistory();
    
    useEffect(() => {
        setWaitingForRender(false);
    }, [props.reloadParent]);

    useEffect(() => {
        const tracker = {};
        for (let volunteer of event.volunteersList) {
            tracker[volunteer.volunteerId] = volunteer.volunteeredTime;
        }
        setVolunteerHours(tracker);
    }, [event.volunteersList]);

    const manageVolunteerHours = (time, id) => {
        const tracker = {...volunteerHours};
        tracker[id] = time;
        setVolunteerHours(tracker);
    }

    const manageVolunteersRequests = async (e, volunteerId) => {
        try {
            setWaitingForRender(true);
            setWaitForRequest(volunteerId);
            await axios.patch(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {confirmed: e.target.checked});
            props.setReloadParent(!props.reloadParent);
            setWaitForRequest(0);
        } catch (err) {
            setFeedback(err);
        }
    }

    const volunteerForEvent = async () => {
        try {
            setWaitingForRender(true);
            await axios.post(`/api/event_attendees/event/${event.event_id}/add/${loggedUser.v_id}`);
            props.setReloadParent(!props.reloadParent);
        } catch (err) {
            setFeedback(err);
        }
    }

    const deleteVolunteerForEvent = async () => {
        try {
            setWaitingForRender(true);
            await axios.delete(`/api/event_attendees/event/${event.event_id}/delete/${loggedUser.v_id}`);
            props.setReloadParent(!props.reloadParent);
        } catch (err) {
            setFeedback(err);
        }
    }

    const attributeHoursForVolunteer = async (e, volunteerId, volunteerName) => {
        try {
            e.preventDefault();
            const hours = volunteerHours[volunteerId];
            if (hours) {
                setWaitingForRender(true);
                await axios.put(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {volunteeredHours: hours});
                setFeedback({message: `Successfully added ${hours} hours to ${volunteerName}`});
                props.setReloadParent(!props.reloadParent);
            }
        } catch (err) {
            setFeedback(err)
        }
    }

    const handleDeleteEvent = async () => {
        try {
            setWaitingForRender(true);
            await axios.delete(`/api/events/${event.event_id}`);
            history.push('/events');
            
        } catch (err) {
            setFeedback(err);
        }
    }

    const handleEditButton = () => {
        history.push(`/event/edit/${event.event_id}`);
    }


    let displayVolunteersList = null;
    if (userIs.admin) {
        displayVolunteersList = event.volunteersList.map(({volunteerId, name, email, deletedProfile, confirmedToEvent, volunteeredTime}) =>
            <div className='form-row' key={volunteerId + name + email}>
                <div className='custom-control custom-switch'>
                    <input
                        type='checkbox'
                        className='custom-control-input'
                        id={volunteerId + name}
                        checked={confirmedToEvent}
                        onChange={e => manageVolunteersRequests(e, volunteerId)}
                        disabled={deletedProfile || waitingForRender}
                    />
                    <label className='custom-control-label mt-2' htmlFor={volunteerId + name}>
                        <span
                            className={`g1VolConfirmedLabel d-none d-sm-block ${confirmedToEvent ? 'g1VolConfirmedLabelOn' : ''}`}
                        >
                            {   waitingForRender && waitForRequest === volunteerId
                                ?   <div className='spinner-grow text-info' role='status'>
                                        <span className='sr-only'>Loading...</span>
                                    </div>
                                :   confirmedToEvent ? 'CONFIRMED' : <span className='mr-3'>PENDING</span>
                            }
                        </span>
                    </label>
                </div>
                <Link   // Link was substituted here to allow user to right-click link and have option to open in new tabs
                    className={`g1VolName btn btn-link mb-2 col-9 col-sm-4 ${confirmedToEvent ? '' : 'g1VolNamePending'}`}
                    to={`/volunteer/${volunteerId}`}
                >
                    {name}
                </Link>
                {
                    confirmedToEvent
                    ?   <form
                            className='g1HoursForm form-inline d-inline-block align-self-center'
                            onSubmit={e => attributeHoursForVolunteer(e, volunteerId, name)}
                        >
                            <input 
                                className='form-control mb-2 mr-sm-2' 
                                type='number' 
                                value={volunteerHours[volunteerId] || 0}
                                onChange={e => manageVolunteerHours(e.target.value, volunteerId)}
                                disabled={waitingForRender}
                            />
                            <button className='btn btn-primary mb-2' disabled={waitingForRender}>Set Hours</button>
                        </form>
                    :   null
                }
            </div>
        );
    }


    const newStart = moment.utc(event.event_start).format('YYYYMMDD[T]HHmmss[Z]');
    const newEnd = moment.utc(event.event_end).format('YYYYMMDD[T]HHmmss[Z]');

    const formatEventDate = date => {
        const d = moment(date).format('M/D/YY');
        let t = moment(date).format('h:mma');

        const minutesPart = moment(date).format('mm');
        if (minutesPart === '00') {
            t = moment(date).format('ha');
        }
        return [d, t.slice(0, -1)];
    }

    const eventStart = formatEventDate(event.event_start);
    const eventEnd = formatEventDate(event.event_end);

    const calendarLink = <a
            href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${event.topic}&dates=${
                newStart}/${newEnd}&details=${event.description}&location=${event.location}&sf=true&output=xml`}
            className='btn btn-primary'
            target='_blank'
            rel='noopener noreferrer'
        >
            Add To Calendar
        </a>

    return (
        <>
            <PMBody>
                <p className='card-text'>
                    {
                        eventStart[0] === eventEnd[0]
                        ?   eventStart[1] === '12a' && eventEnd[1] === '11:59p'
                            ?   <>{eventStart[0]}</>
                            :   <>{eventStart[0]}, {eventStart[1]} <span>-</span> {eventEnd[1]}</>
                        :   eventStart[1] === '12a' && eventEnd[1] === '11:59p'
                            ?   <>{eventStart[0]} <span>—</span> {eventEnd[0]}</>
                            :   <>{eventStart[0]}, {eventStart[1]} <span>—</span> {eventEnd[0]}, {eventEnd[1]}</>
                    }
                </p>
                <p className='card-text'>
                    <strong>Associated Cohorts:</strong> {event.cohort}
                    <br />
                    <strong>Hosted by:</strong> {event.instructor}
                </p>
                <p className='card-text'>
                    {event.description}
                </p>

            </PMBody>
            {
                userIs.admin
                    ?   <>
                            <PMBody className='g1ManageVols'>
                                <p className='card-text'>
                                    <strong>Staff Notes:</strong><br />
                                    {
                                        event.staff_description !== null
                                            ?   event.staff_description
                                            :   <em className='g1EmptyMsg'>No notes to display.</em>
                                    }
                                </p>
                                <p className='card-text'>
                                <strong>Volunteers: </strong>
                                    <em className='g1VolNumConfirmed'>{event.acceptedVolunteers.length} confirmed</em><span>, </span>
                                    <em className='g1VolNumPending'>
                                        {event.volunteersList.filter(volunteer => volunteer[5] === 'false').length} pending</em>
                                    <em className='g1VolNumRequested'> ({event.number_of_volunteers} initially requested)</em>
                                </p>
                                {displayVolunteersList}
                            </PMBody>
                        </>
                    :   null
            }
            <PMFooter className={!userIs.admin ? 'g1NonAdminFooter' : ''}>
                {
                    userIs.admin
                        ?   <>
                                {calendarLink}
                                <PMFooterSpace />
                                <button
                                    className='btn btn-info'
                                    data-dismiss='modal'
                                    onClick={handleEditButton}
                                >
                                    Edit
                                </button>
                                <button
                                    className='btn btn-danger'
                                    data-dismiss='modal'
                                    onClick={handleDeleteEvent}
                                    disabled={waitingForRender}
                                >
                                    Delete
                                </button>
                            </>
                        :   null
                }
                {
                    userIs.volunteer && event.loggedVolunteerPartOfEvent
                        ?   event.loggedVolunteerRequestAccepted
                            ?   <>
                                    {calendarLink}
                                    <PMFooterSpace />
                                    <div className="g1Request g1Confirmed mr-2 pt-2">Confirmed! See you there!</div>
                                    {
                                        new Date(event.event_start).getTime() > Date.now()
                                        ?   <button
                                                className='btn btn-danger g1MinimizeFooterButton'
                                                onClick={deleteVolunteerForEvent}
                                                disabled={waitingForRender}
                                            >
                                                Cancel commitment
                                            </button>
                                        : null
                                    }
                                    
                                </>
                            :   <>
                                    <PMFooterSpace />
                                    <div className="g1Request g1Pending mr-2 pt-2">Request pending!</div>
                                    <button
                                        className='btn btn-warning g1MinimizeFooterButton'
                                        onClick={deleteVolunteerForEvent}
                                        disabled={waitingForRender}
                                    >
                                        Cancel request
                                    </button>
                                </>
                        : userIs.volunteer && Date.now() < new Date(event.event_end).getTime()
                            ?   <>
                                    <PMFooterSpace />
                                    <button
                                        className='btn btn-info'
                                        onClick={volunteerForEvent}
                                        disabled={waitingForRender}
                                    >
                                        Volunteer for this event
                                    </button>
                                </>
                            : null
                }
            </PMFooter>
        </>
    );
}


export default EventCard;
