import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';


const EventCard = (props) => {
    const history = useHistory();
    const { setFeedback, loggedUser, event } = props;

    const [ volunteerHours, setVolunteerHours ] = useState('');
    const [ waitingForRender, setWaitingForRender ] = useState(false);

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
    */
    
    useEffect(() => {
        setWaitingForRender(false)
    }, [props.reloadParent]);

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

    const attributeHoursForVolunteer = async (e, volunteerId) => {
        try {
            e.preventDefault();

            setWaitingForRender(true);
            await axios.put(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {volunteeredHours: volunteerHours});
            setWaitingForRender(false);
            setFeedback({message: `Successfully added ${volunteerHours} hours to volunteer`});
            setVolunteerHours('');
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
    if (loggedUser && loggedUser.admin) {
        displayVolunteersList = event.volunteersList.map(volunteer => 
                <div className='custom-control custom-switch' key={volunteer[0] + volunteer[1] + volunteer[2]}>
                    <input 
                        type='checkbox' 
                        className='custom-control-input' 
                        id={volunteer[0] + volunteer[1]}
                        checked={volunteer[5] === 'true' ? true : false} 
                        onChange={e => manageVolunteersRequests(e, volunteer[0])}
                        disabled={volunteer[3] === 'true' ? true : false || waitingForRender}
                    />
                    <label className='custom-control-label  mt-2' htmlFor={volunteer[0] + volunteer[1]}>
                        <span className={volunteer[3] ? 'd-block text-muted' : 'd-block'}>
                            {`${volunteer[1]}`}
                        </span>
                    </label>
                    <span className='btn btn-link mb-2 mx-3' onClick={e => history.push(`/volunteer/${volunteer[0]}`)}>Profile</span>
                    {
                        volunteer[5] === 'true'
                        ?    <form className='form-inline d-inline-block' onSubmit={e => attributeHoursForVolunteer(e, volunteer[0])}>
                                <input 
                                    className='form-control mb-2 mr-sm-2' 
                                    type='number' 
                                    placeholder='Hours' 
                                    value={volunteerHours}
                                    onChange={e => setVolunteerHours(e.target.value)}
                                    disabled={waitingForRender}
                                />
                                <button className='btn btn-primary  mb-2' disabled={waitingForRender}>Save</button>
                            </form>
                        : null
                    }
                </div>
            )
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
        <div className='lightBox'>
            <div className='text-right closeButton'>
                <button className='btn-sm btn-danger m-2' onClick={props.hideEvent}>X</button>
            </div>

            <div className='border border-dark rounded bg-light m-1'>
                <div className='card-body'>
                    <h4 className='card-title text-center'>{event.topic}</h4>
                    {
                        eventStart[0] === eventEnd[0]
                        ?   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[1]}</p>
                        :   <p>{eventStart[0]} {eventStart[1]} to {eventEnd[0]} {eventEnd[1]}</p>
                    }
                    <p className='card-text'>
                        <strong>Hosted by: </strong>{event.instructor}
                    </p>
                    <p className='card-text'>{event.description} </p>
                    {
                        loggedUser && loggedUser.a_id
                        ? <p className='card-text'><strong>Details: </strong>{event.staff_description} </p>
                        : null
                    }
                    <p className='card-text'><strong>Class: </strong>{event.cohort} </p>
                    {
                        loggedUser && loggedUser.a_id
                        ?   <div className='card-text'>
                                <strong>Volunteers: </strong>{`${event.acceptedVolunteers.length} / ${event.number_of_volunteers}`}
                                {displayVolunteersList}
                                <div className='card-text text-right'>
                                    <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${event.topic}&dates=${newStart}/${newEnd}&details=${event.description}&location=${event.location}&sf=true&output=xml`}
                                        className='btn btn-primary' target='_blank' rel='noopener noreferrer'>Add To Calendar</a>
                                </div>
                            </div>
                            : null
                    }

                    {
                        loggedUser && loggedUser.v_id && event.loggedVolunteerPartOfEvent
                        ?   event.loggedVolunteerRequestAccepted
                            ?   <div className='card-text d-flex justify-content-between'>
                                    <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${event.topic}&dates=${newStart}/${newEnd}&details=${event.description}&location=${event.location}&sf=true&output=xml$`}
                                        className='btn btn-primary' target='_blank' rel='noopener noreferrer'>Add To Calendar</a>
                                    <button className='btn btn-primary float-right' onClick={deleteVolunteerForEvent} disabled={waitingForRender}>Remove</button>
                                </div>
                                : <div className='card-text'>
                                    <span>Request pending</span>
                                    <button className='btn btn-primary float-right' onClick={deleteVolunteerForEvent} disabled={waitingForRender}>Remove</button>
                                </div>
                            : loggedUser && loggedUser.v_id && Date.now() < event.event_end
                                ?
                                    (
                                        <div className='card-text text-right'>
                                            <button className='btn btn-primary' onClick={volunteerForEvent} disabled={waitingForRender}>Volunteer for this event</button>
                                        </div>
                                    )
                                : null
                    }
                </div>
                <hr />

                {
                    loggedUser && loggedUser.admin
                    ?   <div className='d-flex justify-content-between m-2'>
                            <button className='btn btn-outline-danger flex-fill' onClick={handleDeleteEvent} disabled={waitingForRender}>Delete</button>
                            <span className='flex-fill'></span>
                            <button className='btn btn-outline-warning flex-fill' onClick={handleEditButton}>Edit</button>
                        </div>
                    : null
                }
            </div>
        </div>
    );
}

export default EventCard;
