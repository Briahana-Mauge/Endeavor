import React from 'react';
import { useHistory } from 'react-router-dom';


const VolunteerCard = (props) => {
    const history = useHistory();

    const viewProfile = () => {
        props.displayProfile();
        props.setTargetVolunteerId(props.volunteer.v_id)
    }

    const skills = [];
    for (let i = 0; i < Math.min(3, props.volunteer.skills.length); i++) {
        skills.push(props.volunteer.skills[i]);
    }

    /* next event is an string containing the event id and topic, separated by ' &$%& '
        index0: event ID
        index1: event title / topic
    */
    let nextEvent = null;
    if (props.volunteer.next_event) {
        nextEvent = props.volunteer.next_event.split(' &$%& ');
    }

    return (
        <div className='col-12 col-sm-6 col-lg-4'>
            <div className='border border-dark rounded bg-light m-1'>
                <img className='card-img-top' src={props.volunteer.v_picture} alt={`${props.volunteer.v_first_name} ${props.volunteer.v_last_name}'s pic`} />
                <div className='card-body'>
                    <h4 className='card-title'>{props.volunteer.v_first_name} {props.volunteer.v_last_name}</h4>
                    <p className='card-text'>{props.volunteer.title} at {props.volunteer.company}</p>
                    <p className='card-text'>{props.volunteer.v_email}</p>
                    <h5>Skills:</h5>
                    <ul> { skills.map((skill, index) => <p className='card-text' key={index+skill}>{skill}</p>) }</ul>
                    {   props.volunteer.next_event
                        ? <h5>Next Event: <span onClick={e => history.push(`/event/${nextEvent[0]}`)}>{nextEvent[1]}</span></h5>
                        : null
                    }
                    <div className='text-right'>
                        <button className='btn btn-primary' onClick={viewProfile}>See Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VolunteerCard;
