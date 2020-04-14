import React from 'react';
import { Link} from 'react-router-dom';

const EventsSearchCard = (props) => {
    console.log(props)
    return (
        <div class="card" style={{ width: 400 }}>
            <div class="card-body">
                <h4 class="card-title">{props.event.topic}</h4>
                <p>{new Date(props.event.event_start).toLocaleString()}</p>
                <p class="card-text">
                    Hosted by: {props.event.instructor}
                    </p>
                <p class="card-text">{props.event.description} </p>
                <p class="card-text">Class: {props.event.class} </p>
                {
                (props.event.volunteers) ?
                <p class="card-text">Volunteers: {props.event.volunteers}</p>
                : <p class="card-text">Volunteers: TBA</p>
                }
                
       

                {/* <h5>Skills:</h5>
                <ul>
                    <p class="card-text">{props.volunteer.skills[0]}</p>
                    <p class="card-text">{props.volunteer.skills[1]}</p>
                    <p class="card-text">{props.volunteer.skills[2]}</p>
                </ul>
                <h5>Next Event: {props.volunteer.topics[0]} (make this a link)</h5>
                <Link to={`/volunteers/${props.volunteer.v_id}`}>
                    <a href="#" class="btn btn-primary">See Profile</a>
                    </Link> */}
            </div>
        </div>
    );
}

export default EventsSearchCard;
