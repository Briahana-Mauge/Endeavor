/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
VolunteerPreviewCard Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


export default function VolunteerPreviewCard(props) {
    const { volunteer } = props;

    return (
        <div className='g1NewVolCard row p-2'>

            <div className='g1NewVolBtns col-12 col-md-3'>
                <button className='btn btn-success mr-2 mr-md-0 mb-md-2' onClick={e => props.acceptVolunteer(volunteer.v_id)}>Accept</button>
                <button className='btn btn-primary' onClick={e => e.preventDefault()}>Message</button>
            </div>

            <div className='g1NewVolData col-12 col-md-9'>
                <img className='g1Avatar mr-2 mb-2' src={volunteer.v_picture} alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}/>

                <div className='g1NVName'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</div>
                <a className='d-block' href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                    {volunteer.v_email} 
                </a>
                <span className='d-block'>{volunteer.company}</span>
                <span className='d-block'>{volunteer.title}</span>
                <ul className='g1NewVolSkills'> <strong>Skills / Workshops:</strong>
                    { volunteer.skills.map(skill => <li key={skill}>{skill}</li>) }
                </ul>
            </div>

        </div>
    )
}