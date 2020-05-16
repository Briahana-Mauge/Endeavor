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

    const userIs = identifyUser(loggedUser);
    const history = useHistory();

    /* 
        props.event.volunteers_list is an array of STRING 
        where reach element is all one volunteer information related to that event separated by ,
        if split(', ') we will have:
            index0: volunteer ID
            index1: first and last name
            index2: email
            index3: volunteer profile deleted
            index4: event_volunteers table id
            index5: volunteer confirmed to event
            index6: volunteered time on that event
    */
    
    useEffect(() => {
        setWaitingForRender(false);
    }, [props.reloadParent]);

    useEffect(() => {
        const tracker = {};
        for (let volunteerArr of event.volunteersList) {
            tracker[volunteerArr[0]] = volunteerArr[6];
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
            await axios.patch(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {confirmed: e.target.checked});
            props.setReloadParent(!props.reloadParent);
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
            await axios.delete(`/api/events/${event.event_id}`)
            props.setReloadParent(!props.reloadParent);
            props.hideEvent();
        } catch (err) {
            setFeedback(err);
        }
    }

    const handleEditButton = () => {
        history.push(`/event/edit/${event.event_id}`);
    }


    let displayVolunteersList = null;
    if (userIs.admin) {
        displayVolunteersList = event.volunteersList.map(([
            volunteerId,
            fullname,
            email,
            isProfileDeleted,
            eventVolunteerId,
            isConfirmedForEvent,
            eventHoursAssigned
        ]) =>
            <div className='form-row' key={volunteerId + fullname + email}>
                <div className='custom-control custom-switch'>
                    <input
                        type='checkbox'
                        className='custom-control-input'
                        id={volunteerId + fullname}
                        checked={isConfirmedForEvent === 'true' ? true : false}
                        onChange={e => manageVolunteersRequests(e, volunteerId)}
                        disabled={isProfileDeleted === 'true' ? true : false || waitingForRender}
                    />
                    <label className='custom-control-label mt-2' htmlFor={volunteerId + fullname}>
                        <span
                            className={`g1VolConfirmedLabel d-none d-sm-block ${isConfirmedForEvent === 'true' ? 'g1VolConfirmedLabelOn' : ''}`}
                        >
                            {isConfirmedForEvent === 'true' ? 'CONFIRMED' : 'PENDING'}
                        </span>
                    </label>
                </div>
                <Link   // Link was substituted here to allow user to right-click link and have option to open in new tabs
                    className={`g1VolName btn btn-link mb-2 col-9 col-sm-4 ${isConfirmedForEvent === 'false' ? 'g1VolNamePending' : ''}`}
                    to={`/volunteer/${volunteerId}`}
                    target="_blank" // because this is already a modal, best sense is to open profile in new tab to preserve location
                >
                    {fullname}
                </Link>
                {
                    isConfirmedForEvent === 'true'
                        ?   <form
                                className='g1HoursForm form-inline d-inline-block align-self-center'
                                onSubmit={e => attributeHoursForVolunteer(e, volunteerId, fullname)}
                            >
                                <input 
                                    className='form-control mb-2 mr-sm-2' 
                                    type='number' 
                                    // placeholder='0'
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
        const d = new Date(date).toLocaleDateString();
        const t = new Date(date).toLocaleTimeString();
        return [d, `${t.slice(0, -6)} ${t.slice(-2)}`];
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
        // <div className='lightBox'>
        //     <div className='text-right closeButton'>
        //         <button className='btn-sm btn-danger m-2' onClick={props.hideEvent}>X</button>
        //     </div>
        <>
            <PMBody>
                {
                    eventStart[0] === eventEnd[0]
                    ?   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                        ?   <p>{eventStart[0]}</p>
                        :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[1]}</p>
                    :   eventStart[1] === '12:00 AM' && eventEnd[1] === '11:59 PM'
                        ?   <p>{eventStart[0]} to {eventEnd[0]}</p>
                        :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[0]} {eventEnd[1]}</p>
                }
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
                                    <em className='g1VolNumConfirmed'>{event.acceptedVolunteers.length} confirmed</em>,
                                    <em className='g1VolNumPending'>
                                        {event.volunteersList.filter(volunteer => volunteer[5] === 'false').length} pending</em>
                                    <em className='g1VolNumRequested'>({event.number_of_volunteers} initally requested)</em>
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
                                    <div className="g1Request g1Confirmed">Confirmed! See you there!</div>
                                    <button
                                        className='btn btn-danger g1MinimizeFooterButton'
                                        onClick={deleteVolunteerForEvent}
                                        disabled={waitingForRender}
                                    >
                                        Cancel commitment
                                    </button>
                                </>
                            :   <>
                                    <PMFooterSpace />
                                    <div className="g1Request g1Pending">Request pending</div>
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
            // </div>
        // </div>
    );
}


export default EventCard;
