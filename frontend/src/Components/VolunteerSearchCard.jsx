import React from 'react';
import { Link} from 'react-router-dom';

const VolunteerSearchCard = (props) => {
    console.log(props)
    return (
        <div class="card" style={{ width: 400 }}>
            <img class="card-img-top" src={props.volunteer.v_picture} alt={`${props.volunteer.v_first_name} ${props.volunteer.v_last_name}'s picture`} />
            <div class="card-body">
                <h4 class="card-title">{props.volunteer.v_first_name} {props.volunteer.v_last_name}</h4>
                <p class="card-text">{props.volunteer.title} at {props.volunteer.company}</p>
                <p class="card-text">{props.volunteer.v_email}</p>
                <h5>Skills:</h5>
                <ul>
                    <p class="card-text">{props.volunteer.skills[0]}</p>
                    <p class="card-text">{props.volunteer.skills[1]}</p>
                    <p class="card-text">{props.volunteer.skills[2]}</p>
                </ul>
                <h5>Next Event: {props.volunteer.topics[0]} (make this a link)</h5>
                <Link to={`/volunteers/${props.volunteer.v_id}`}>
                    <a href="#" class="btn btn-primary">See Profile</a>
                    </Link>
            </div>
        </div>
    );
}

export default VolunteerSearchCard;
