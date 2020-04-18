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
    }, [volunteersList])


    const manageVolunteersRequests = async (e, volunteerId) => {
        try {
            await axios.patch(`/api/event_attendees/event/${event.event_id}/volunteer/${volunteerId}`, {confirmed: e.target.checked});
            setReload(reload + 1);
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

    return (
        <div className='card' style={{ width: 400 }}>
            {
                props.role 
                ?   <div className='d-flex flex-wrap justify-content-between'>
                        <button className='btn btn-outline-danger flex-fill' onClick={e => props.delete(event.event_id)}>Delete</button>
                        <span className='flex-fill'></span>
                        <button className='btn btn-outline-warning flex-fill' onClick={e => props.edit(event)}>Edit</button>
                    </div>
                : null
            }

            <div className='card-body'>
                <h4 className='card-title'>{event.topic}</h4>
                <p>{new Date(event.event_start).toLocaleString()} - {new Date(event.event_end).toLocaleString()}</p>
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
                    loggedUser && loggedUser.v_id && loggedVolunteerPartOfEvent
                    ? loggedVolunteerRequestAccepted 
                        ?   <div className='card-text text-right'><button className='btn btn-primary' onClick={deleteVolunteerForEvent}>Remove</button></div>
                        :   <div className='card-text d-flex flex-wrap justify-content-between'>
                                <span>Request pending</span>
                                <button className='btn btn-primary' onClick={deleteVolunteerForEvent}>Remove</button>
                            </div>
                    :   loggedUser && loggedUser.v_id
                        ?   <div className='card-text text-right'>
                                <button className='btn btn-primary' onClick={volunteerForEvent}>Volunteer for this event</button>
                            </div>
                        : null
                }
                {/* <h5>Skills:</h5>
                <ul>
                    <p className='card-text'>{props.volunteer.skills[0]}</p>
                    <p className='card-text'>{props.volunteer.skills[1]}</p>
                    <p className='card-text'>{props.volunteer.skills[2]}</p>
                </ul>
                <h5>Next Event: {props.volunteer.topics[0]} (make this a link)</h5>
                <Link to={`/volunteers/${props.volunteer.v_id}`}>
                    <a href='#' className='btn btn-primary'>See Profile</a>
                    </Link> */}
            </div>
        </div>
    );
}

export default EventsCard;
