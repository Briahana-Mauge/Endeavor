import React from 'react';
// import { Link } from 'react-router-dom';

const EventsSearchCard = (props) => {
    return (
        <div className='card' style={{ width: 400 }}>
            {props.role ?
                <button onClick={e => props.delete(e, props.event.event_id)}>Delete</button>
                : null
            }
            {/* // <button onClick = {e => props.delete(e, props.event.event_id)}>Delete</button> */}
            {/* <button onClick = {e => props.edit(e, props.event.event_id)}>Edit</button> */}

            <div className='card-body'>
                <h4 className='card-title'>{props.event.topic}</h4>
                <p>{new Date(props.event.event_start).toLocaleString()} - {new Date(props.event.event_end).toLocaleString()}</p>
                <p className='card-text'>
                    Hosted by: {props.event.instructor}
                </p>
                <p className='card-text'>{props.event.description} </p>
                <p className='card-text'>Class: {props.event.cohort} </p>
                {
                    (props.event.volunteers[0] === null) ? //if there are no volunteers, show TBA. Otherwise, show thet volunteers
                        <p className='card-text'>Volunteers: TBA</p>
                        :<p className='card-text'>Volunteers: {props.event.volunteers.join(', ')}
                        </p>
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

export default EventsSearchCard;
