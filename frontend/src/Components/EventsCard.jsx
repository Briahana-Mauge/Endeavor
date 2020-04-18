import React from 'react';
import moment from 'moment';

const EventsCard = (props) => {
    let start = props.event.event_start;
    let newStart = moment.utc(start).format('YYYYMMDD[T]HHmmss[Z]');

    let end = props.event.event_end;
    let newEnd = moment.utc(end).format('YYYYMMDD[T]HHmmss[Z]');

    let vEmails = '';
    if (props.event.v_email) {
        props.event.v_email.forEach(email => {
            vEmails += `&add=${email}`;
        });
    }


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
                    (props.event.volunteers[0] === null) ? //if there are no volunteers, show TBA. Otherwise, show the volunteers
                        <p className='card-text'>Volunteers: TBA</p>
                        : <p className='card-text'>Volunteers: {props.event.volunteers.join(', ')}
                        </p>
                }


                {/* Look for a way to edit an added event with using an api */}
                {props.role ?
                    <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${props.event.topic}&dates=${newStart}/${newEnd}&details=${props.event.description}&location=${props.event.location}&sf=true&output=xml${vEmails}`}
                        target="_blank" rel="nofollow"><button>Add To Cal</button></a>
                    : null
                }

            </div>
        </div>
    );
}

export default EventsCard;
