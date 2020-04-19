import React from 'react';

const VolunteerSearchCard = (props) => {
    const viewProfile = () => {
        props.displayProfile();
        props.setTargetVolunteerId(props.volunteer.v_id)
    }
    return (
        <div className='col-12 col-sm-6 col-lg-4'>
            <div className='border border-dark rounded bg-light m-1'>
                <img className="card-img-top" src={props.volunteer.v_picture} alt={`${props.volunteer.v_first_name} ${props.volunteer.v_last_name}'s pic`} />
                <div className="card-body">
                    <h4 className="card-title">{props.volunteer.v_first_name} {props.volunteer.v_last_name}</h4>
                    <p className="card-text">{props.volunteer.title} at {props.volunteer.company}</p>
                    <p className="card-text">{props.volunteer.v_email}</p>
                    <h5>Skills:</h5>
                    <ul>
                        <p className="card-text">{props.volunteer.skills[0]}</p>
                        <p className="card-text">{props.volunteer.skills[1]}</p>
                        <p className="card-text">{props.volunteer.skills[2]}</p>
                    </ul>
                    <h5>Next Event: {props.volunteer.topics[0]} (make this a link)</h5>
                    <button className='btn btn-primary float-right' onClick={viewProfile}>See Profile</button>
                </div>
            </div>
        </div>
    );
}

export default VolunteerSearchCard;
