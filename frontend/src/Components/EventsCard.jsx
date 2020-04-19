import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';

const EventsCard = (props) => {
    const { setFeedback, loggedUser, event } = props;
    const [ volunteersList, setVolunteersList ] = useState([]);
    const [ loggedVolunteerPartOfEvent, setLoggedVolunteerPartOfEvent ] = useState(false);
    const [ loggedVolunteerRequestAccepted, setLoggedVolunteerRequestAccepted ] = useState(false);
    const [ reload, setReload ] = useState(0);

    const getVolunteersList = () => {
        axios.get(`/api/event_attendees/volunteers/${event.event_id}`)
            .then(response => setVolunteersList(response.data.payload))
            .catch(err => setFeedback(err))
    }
    useEffect(getVolunteersList, [reload]);

    useEffect(() => {
        const checkIfVolunteerSignedForEvent = () => {
            let found = false;
            let accepted = false;
            for (let volunteer of volunteersList) {
                if (loggedUser && loggedUser.v_id && loggedUser.v_id === volunteer.v_id) {
                    found = true;
                    if (volunteer.volunteer_request_accepted) {
                        accepted = true
                    }
                    break;
                }
            }
            setLoggedVolunteerPartOfEvent(found);
            setLoggedVolunteerRequestAccepted(accepted);
        }
        
        checkIfVolunteerSignedForEvent();
    }, [loggedUser, volunteersList])


    const manageVolunteersRequests = async (e, volunteerId) => {
        try {
            await axios.patch(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {confirmed: e.target.checked});
            setReload(reload + 1);
            if (props.setReload) {
                props.setReload(props.reload + 1);
            }
        } catch (err) {
            setFeedback(err);
        }
    }

    const volunteerForEvent = async () => {
        try {
            await axios.post(`/api/event_attendees/event/${event.event_id}/add/${loggedUser.v_id}`);
            setReload(reload + 1);
        } catch (err) {
            setFeedback(err);
        }
    }

    const deleteVolunteerForEvent = async () => {
        try {
            await axios.delete(`/api/event_attendees/event/${event.event_id}/delete/${loggedUser.v_id}`);
            setReload(reload + 1);
        } catch (err) {
            setFeedback(err);
        }
    }

    let displayVolunteersList = 'TBA'
    if (volunteersList.length && loggedUser && loggedUser.admin) {
        displayVolunteersList = volunteersList.map(volunteer => 
                <div key={volunteer.v_id + volunteer.v_last_name}>
                    <div className='form-group form-check'>
                        <label className='form-check-label'>
                            <input className='form-check-input' 
                                type='checkbox' 
                                checked={volunteer.volunteer_request_accepted} 
                                onChange={e => manageVolunteersRequests(e, volunteer.v_id)}
                                disabled={volunteer.deleted}
                            /> 
                            <span className={volunteer.deleted ? 'd-block text-muted' : 'd-block'}>
                                {`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                            </span>
                            {volunteer.deleted ? <span>(Left the platform)</span> : null}
                        </label>
                    </div>
                </div>
            )
    } else if (volunteersList.length) {
        displayVolunteersList = volunteersList.map(volunteer => 
            <div key={volunteer.v_id + volunteer.v_last_name}>
                {
                    volunteer.volunteer_request_accepted 
                    ? <span className='d-block'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</span> 
                    : null
                }
                
            </div>
        )
    }

    const formatEventDate = date => {
        const d = new Date(date).toLocaleDateString();
        const t = new Date(date).toLocaleTimeString();
        return `${d} ${t.slice(0, -6)} ${t.slice(-2)}`;
    }

    return (
        <div className='col-12 col-sm-6 col-lg-4'>
            <div className='border border-dark rounded bg-light m-1'>
                {
                    loggedUser && loggedUser.admin && props.delete && props.edit
                    ?   <div className='d-flex justify-content-between'>
                            <button className='btn btn-outline-danger flex-fill' onClick={e => props.delete(event.event_id)}>Delete</button>
                            <span className='flex-fill'></span>
                            <button className='btn btn-outline-warning flex-fill' onClick={e => props.edit(event)}>Edit</button>
                        </div>
                    : null
                }

                <div className='card-body'>
                    <h4 className='card-title'>{event.topic}</h4>
                    <p>{formatEventDate(event.event_start)} - {formatEventDate(event.event_end)}</p>
                    <p className='card-text'>
                        <strong>Hosted by: </strong>{event.instructor}
                    </p>
                    <p className='card-text'>{event.description} </p>
                    <p className='card-text'><strong>Class: </strong>{event.cohort} </p>
                    {
                        loggedUser && loggedUser.a_id
                        ? <p className='card-text'><strong>Number of needed volunteers: </strong>{event.volunteers_needed} </p>
                        : null
                    }
                    <div className='card-text'><strong>Volunteers: </strong>{displayVolunteersList} </div>
                    {
                        loggedUser && loggedUser.a_id
                        ? <div className='card-text float-right'><a>ADD TO CALENDAR LINK (PLACE HOLDER)</a></div>
                        : null
                    }
                    
                    {
                        loggedUser && loggedUser.v_id && loggedVolunteerPartOfEvent
                        ? loggedVolunteerRequestAccepted 
                            ?   <div className='card-text d-flex'>
                                    <a>ADD TO CALENDAR LINK (PLACE HOLDER)</a>
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
            </div>
        </div>
    );
}

export default EventsCard;
