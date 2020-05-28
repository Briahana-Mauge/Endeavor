import React from 'react';
import { useHistory } from 'react-router-dom';


const VolunteerCard = (props) => {
    const history = useHistory();

    const viewProfile = () => {
        props.setDisplayTargetUser(true);
        props.setTargetVolunteerId(props.volunteer.v_id);
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
        <div className='g1VolResultCard px-1 py-2'>
            <div className='g1InnerVolResultCard'>
                <h4
                    className='g1VolResultCard__Name'
                    onClick={viewProfile}
                    data-toggle="modal"
                    data-target="#primaryModal"
                >
                    {props.volunteer.v_first_name} {props.volunteer.v_last_name}
                </h4>
                <div className='g1VolResultCard__Email'>
                    {props.volunteer.v_email}
                </div>
                <div className='g1VolResultCard__Job'>
                    {props.volunteer.company}<br />
                    {props.volunteer.title}
                </div>
                <img
                    className='g1VolResultCard__Avatar'
                    src={props.volunteer.v_picture || '/images/default_pic.png'}
                    alt={`${props.volunteer.v_first_name} ${props.volunteer.v_last_name}'s pic`}
                    onClick={viewProfile}
                    data-toggle="modal"
                    data-target="#primaryModal"
                />
                <div className='card-body d-flex flex-column p-3'>



                    <p className='card-text'></p>
                    <h5>Skills:</h5>
                    <p className='card-text'>
                        { skills.map((skill, index) => <span className='d-block' key={index+skill}>{skill}</span>) }
                    </p>
                    {   props.volunteer.next_event
                        ?   <div className='card-text'> Next Event: <br />
                                <span style={{ cursor: 'pointer' }} onClick={e => history.push(`/event/${nextEvent[0]}`)}>{nextEvent[1]}</span>
                            </div>
                        : null
                    }
                    <div className='text-left mt-auto'>
                        <button className='btn btn-primary' onClick={viewProfile} data-toggle="modal" data-target="#primaryModal">See Profile</button>
                    </div>
                </div>
                </div>
        </div>
    );
}

export default VolunteerCard;
