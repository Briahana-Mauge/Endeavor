import React from 'react';


export default function VolunteerPreviewCard(props) {
    const { volunteer } = props;

    return (
        <div className='row p-2' style={{minWidth: '320px'}}>
            <div className='col-sm-6'>
                <img className='d-block rounded-circle imageIcon' src={volunteer.v_picture} alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}/>
                <strong className='d-block'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</strong>
                <a className='d-block' href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                    {volunteer.v_email} 
                </a>
            </div>

            <div className='col-sm-6'>
                <span className='d-block'>{`${volunteer.title} at ${volunteer.company}`}</span>
                <ul className='skillsUl'> <strong>Skills / Workshops:</strong>
                    { volunteer.skills.map(skill => <li key={skill}>{skill}</li>) }
                </ul>
                <button className='btn btn-primary float-right' onClick={e => props.acceptVolunteer(volunteer.v_id)}>Accept</button>
            </div>
        </div>
    )
}