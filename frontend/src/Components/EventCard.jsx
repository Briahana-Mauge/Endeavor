import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { PMBody, PMFooter } from './Modals/PrimaryModal';
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
            <div className='custom-control custom-switch' key={volunteerId + fullname + email}>
                <input 
                    type='checkbox' 
                    className='custom-control-input' 
                    id={volunteerId + fullname}
                    checked={isConfirmedForEvent === 'true' ? true : false}
                    onChange={e => manageVolunteersRequests(e, volunteerId)}
                    disabled={isProfileDeleted === 'true' ? true : false || waitingForRender}
                />
                {console.log("RENDER")}
                <label className='custom-control-label mt-2' htmlFor={volunteerId + fullname}>
                    {isConfirmedForEvent === 'true' ? 'CONFIRMED' : ''}
                </label>
                <span className='btn btn-link mb-2 mx-3' onClick={e => history.push(`/volunteer/${volunteerId}`)}>
                    <span className={isConfirmedForEvent === "true" ? 'd-block' : 'd-block text-muted'}>
                        {`${fullname}`}
                    </span>
                    Profile
                </span>
                {
                    isConfirmedForEvent === 'true'
                        ?   <form
                                className='form-inline d-inline-block'
                                onSubmit={e => attributeHoursForVolunteer(e, volunteerId, fullname)}
                            >
                                <input 
                                    className='form-control mb-2 mr-sm-2' 
                                    type='number' 
                                    placeholder='Hours' 
                                    value={volunteerHours[volunteerId] || ''}
                                    onChange={e => manageVolunteerHours(e.target.value, volunteerId)}
                                    disabled={waitingForRender}
                                />
                                <button className='btn btn-primary mb-2' disabled={waitingForRender}>Save</button>
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


    return (
        <>
            <PMBody>
                {
                    eventStart[0] === eventEnd[0]
                        ?   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[1]}</p>
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
            <PMBody className="g1ManageVols">
                {
                    userIs.admin
                        ?   <>
                                <p className='card-text'>
                                    <strong>Details:</strong> {event.staff_description}
                                    <strong>Volunteers:</strong> {`${event.acceptedVolunteers.length} / ${event.number_of_volunteers}`}
                                </p>
                                {displayVolunteersList}
                            </>
                        :   null
                }
            </PMBody>
            <PMFooter>
                {
                    userIs.admin
                        ?   <div className='d-flex justify-content-between m-2'>
                                <a
                                    href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${
                                        event.topic}&dates=${newStart}/${newEnd}&details=${
                                        event.description}&location=${event.location}&sf=true&output=xml`}
                                    className='btn btn-primary'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Add To Calendar
                                </a>
                                <button
                                    className='btn btn-outline-danger flex-fill'
                                    data-dismiss='modal'
                                    onClick={handleDeleteEvent}
                                    disabled={waitingForRender}
                                >
                                    Delete
                                </button>
                                <span className='flex-fill'></span>
                                <button
                                    className='btn btn-outline-warning flex-fill'
                                    data-dismiss='modal'
                                    onClick={handleEditButton}
                                >
                                    Edit
                                </button>
                            </div>
                        :   null
                }
                {
                    userIs.volunteer && event.loggedVolunteerPartOfEvent
                        ?   event.loggedVolunteerRequestAccepted
                            ?   <div className='card-text d-flex justify-content-between'>
                                    <a
                                        href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${
                                            event.topic}&dates=${newStart}/${newEnd}&details=${event.description}&location=${
                                            event.location}&sf=true&output=xml$`}
                                        className='btn btn-primary'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        Add To Calendar
                                    </a>
                                    <button
                                        className='btn btn-primary float-right'
                                        onClick={deleteVolunteerForEvent}
                                        disabled={waitingForRender}
                                    >
                                        Remove
                                    </button>
                                </div>
                            :   <div className='card-text'>
                                    <span>Request pending</span>
                                    <button
                                        className='btn btn-primary float-right'
                                        onClick={deleteVolunteerForEvent}
                                        disabled={waitingForRender}
                                    >
                                        Remove
                                    </button>
                                </div>
                        : userIs.volunteer && Date.now() < new Date(event.event_end).getTime()
                            ?   <div className='card-text text-right'>
                                    <button
                                        className='btn btn-primary'
                                        onClick={volunteerForEvent}
                                        disabled={waitingForRender}
                                    >
                                        Volunteer for this event
                                    </button>
                                </div>
                            : null
                }
            </PMFooter>
        </>
    );
}


export default EventCard;
