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

            <div className='col-3'>
                <button className='btn btn-success mb-2' onClick={e => props.acceptVolunteer(volunteer.v_id)}>Accept</button>
                <button className='btn btn-primary' onClick={e => e.preventDefault()}>Message</button>
            </div>

            <div className='col-4'>
                <img className='d-block rounded-circle imageIcon' src={volunteer.v_picture} alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}/>
                <strong className='d-block'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</strong>
                <a className='d-block' href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                    {volunteer.v_email} 
                </a>
            </div>

            <div className='col-5'>
                <span className='d-block'>{`${volunteer.title} at ${volunteer.company}`}</span>
                <ul className='skillsUl'> <strong>Skills / Workshops:</strong>
                    { volunteer.skills.map(skill => <li key={skill}>{skill}</li>) }
                </ul>
            </div>

        </div>
    )
}