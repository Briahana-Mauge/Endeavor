/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
VolunteerPreviewCard Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';


export default function VolunteerPreviewCard(props) {
    const { volunteer } = props;

    return (
        <div className='g1NewVolCard row'>

            <div className='col-lg-1'></div>

            <div className='g1NewVolBtns col-6 offset-6 offset-lg-0 col-lg-4 mb-3 mb-lg-0'>
                <button className='btn btn-success mb-lg-2' onClick={e => props.acceptVolunteer(volunteer.v_id)}>Accept</button>
                <button className='btn btn-primary mx-2 mx-lg-0' onClick={e => e.preventDefault()}>Message</button>
            </div>

            <div className='g1NewVolData col-12 col-lg-7'>
                <img className='g1Avatar ml-3 ml-md-0 mr-md-3 mb-3' src={volunteer.v_picture} alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}/>

                <div className='g1NVFaceDate'>
                    <div className='g1NVName'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</div>
                    <a className='d-block' href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                        {volunteer.v_email}
                    </a>
                    <span className='d-block'>{volunteer.company}</span>
                    <span className='d-block'>{volunteer.title}</span>
                </div>
                <ul className='g1NewVolSkills'>
                    <strong>Skills / Workshops</strong>
                    { volunteer.skills.map(skill => <li key={skill}>{skill}</li>) }
                </ul>
            </div>

        </div>
    )
}