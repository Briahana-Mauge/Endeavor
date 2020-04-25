import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';


const EventsCard = (props) => {
    const { setFeedback, loggedUser, event } = props;

    const [ volunteerHours, setVolunteerHours ] = useState('');
    const [ volunteersList, setVolunteersList] = useState([]);
    
    useEffect(() => {
        setVolunteersList(event.volunteersList);
    }, [event.reload]);

    const manageVolunteersRequests = async (e, volunteerId) => {
        try {
            await axios.patch(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {confirmed: e.target.checked});
            event.setReload(event.reload + 1);
        } catch (err) {
            setFeedback(err);
        }
    }

    const volunteerForEvent = async () => {
        try {
            await axios.post(`/api/event_attendees/event/${event.event_id}/add/${loggedUser.v_id}`);
            props.setReloadParent(!props.reloadParent);
        } catch (err) {
            setFeedback(err);
        }
    }

    const deleteVolunteerForEvent = async () => {
        try {
            await axios.delete(`/api/event_attendees/event/${event.event_id}/delete/${loggedUser.v_id}`);
            props.setReloadParent(!props.reloadParent);
        } catch (err) {
            setFeedback(err);
        }
    }

    const attributeHoursForVolunteer = async (e, volunteerId) => {
        try {
            e.preventDefault();


            await axios.put(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {volunteeredHours: event.volunteerHours});
            setFeedback({message: `Successfully added ${volunteerHours} hours to volunteer`});
            event.setVolunteerHours('');
        } catch (err) {
            setFeedback(err)
        }
    }


    const handleDeleteEvent = async () => {
        try {
            await axios.delete(`/api/events/${event.event_id}`)
            props.setReloadParent(!props.reloadParent);
            props.hideEvent();
        } catch (err) {
            setFeedback(err);
        }
    }

    const handleEditButton = () => {

    }

    let displayVolunteersList = null;
    if (volunteersList.length && loggedUser && loggedUser.admin) {
        displayVolunteersList = volunteersList.map(volunteer => 
                <div className='custom-control custom-switch' key={volunteer.v_id + volunteer.v_last_name + event.event_id}>
                    <input 
                        type='checkbox' 
                        className='custom-control-input' 
                        id={volunteer.v_id + volunteer.v_last_name + event.event_id}
                        checked={volunteer.volunteer_request_accepted} 
                        onChange={e => manageVolunteersRequests(e, volunteer.v_id)}
                        disabled={volunteer.deleted}
                    />
                    <label className='custom-control-label  mt-2' htmlFor={volunteer.v_id + volunteer.v_last_name + event.event_id}>
                        <span className={volunteer.deleted ? 'd-block text-muted' : 'd-block'}>
                            {`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                        </span>
                    </label>
                    <span className='btn btn-link mb-2 mx-3'>Profile</span> {/* WILL BE A LINK TO VOLUNTEER PROFILE */}
                    {
                        volunteer.volunteer_request_accepted
                        ?    <form className='form-inline d-inline-block' onSubmit={e => attributeHoursForVolunteer(e, volunteer.v_id)}>
                                <input 
                                    className='form-control mb-2 mr-sm-2' 
                                    type='number' 
                                    placeholder='Hours' 
                                    value={volunteerHours}
                                    onChange={e => setVolunteerHours(e.target.value)}
                                />
                                <button className='btn btn-primary  mb-2'>Save</button>
                            </form>
                        : null
                    }
                </div>
            )
    }
        
    const newStart = moment.utc(event.event_start).format('YYYYMMDD[T]HHmmss[Z]');
    const newEnd = moment.utc(event.event_end).format('YYYYMMDD[T]HHmmss[Z]');

    let numberOfConfirmedVolunteers = 0;
    if (event.volunteersEmailList) {
        numberOfConfirmedVolunteers = event.volunteersEmailList.split('&add=').length - 1;
    }

    const formatEventDate = date => {
        const d = new Date(date).toLocaleDateString();
        const t = new Date(date).toLocaleTimeString();
        return [d, `${t.slice(0, -6)} ${t.slice(-2)}`];
    }

    const eventStart = formatEventDate(event.event_start);
    const eventEnd = formatEventDate(event.event_end);

    return (
        <div className='lightBox'>
            <div className='text-right m-2 closeButton'>
                 <button className='btn-sm btn-danger' onClick={props.hideEvent}>X</button>
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
                                <strong>Volunteers: </strong>{`${numberOfConfirmedVolunteers} / ${event.number_of_volunteers}`}
                                {displayVolunteersList}
                                <div className='card-text text-right'>
                                    <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${event.topic}&dates=${newStart}/${newEnd}&details=${event.description}&location=${event.location}&sf=true&output=xml${event.volunteersEmailList}`}
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
                                    <button className='btn btn-primary float-right' onClick={deleteVolunteerForEvent}>Remove</button>
                                </div>
                            :   <div className='card-text'>
                                    <span>Request pending</span>
                                    <button className='btn btn-primary float-right' onClick={deleteVolunteerForEvent}>Remove</button>
                                </div>
                        :   loggedUser && loggedUser.v_id
                            ?   <div className='card-text text-right'>
                                    <button className='btn btn-primary' onClick={volunteerForEvent}>Volunteer for this event</button>
                                </div>
                            : null
                    }
                </div>
                <hr />

                {
                    loggedUser && loggedUser.admin
                    ?   <div className='d-flex justify-content-between m-2'>
                            <button className='btn btn-outline-danger flex-fill' onClick={handleDeleteEvent}>Delete</button>
                            <span className='flex-fill'></span>
                            <button className='btn btn-outline-warning flex-fill' onClick={handleEditButton}>Edit</button>
                        </div>
                    : null
                }
            </div>
        </div>
    );
}

export default EventsCard;
