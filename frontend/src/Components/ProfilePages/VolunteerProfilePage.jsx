import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VolunteerProfilePage(props) {
    const [ volunteer, setVolunteer ] = useState({});
    const [ events, setEvents ] = useState([]);
    const [ mentees, setMentees ] = useState([]);
    const [ tasks, setTasks ] = useState([]);

    const getVolunteerData = async (volunteerId) => {
        try { 
            if (volunteerId) {
                const { data } = await axios.get(`/api/volunteers/id/${volunteerId}`);
                setVolunteer(data.payload);
                
                setTasks([
                    ['mentoring', data.payload.mentoring], 
                    ['being an Office Hours mentor', data.payload.office_hours], 
                    ['administering mock technical interviews', data.payload.tech_mock_interview], 
                    ['behavioral interviewing', data.payload.behavioral_mock_interview], 
                    ['being a professional skills coach', data.payload.professional_skills_coach],
                    ['hosting a Site Visit at your office', data.payload.hosting_site_visit],
                    ['being an Industry Speaker', data.payload.industry_speaker]
                ].filter(task => task[1]));
    
                const promises = [];
                promises.push(axios.get(`/api/mentor_pairs/volunteer/${volunteerId}`));
                promises.push(axios.get(`/api/events/past/volunteer/${volunteerId}`));
                const response = await Promise.all(promises);

                setMentees(response[0].data.payload);
                setEvents(response[1].data.payload);
            }
        } catch (err) {
            props.setFeedback(err);
        }
    }

    useEffect(() => {
        getVolunteerData(props.volunteerId);
    }, [props.volunteerId])

    return (
        <>
            <div className='row'>
                {
                    volunteer.deleted
                    ? <div className='col-12 bg-warning text-white text-center'>This volunteer has left the platform</div>
                    : null
                }

                <div className='col-sm-6'>
                    <img 
                        className='d-block w-100'
                        src={volunteer.v_picture} 
                        alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                    />
                    <span className='d-block'><strong>Volunteered Hours: </strong>{volunteer.banked_time}</span>
                </div>

                <div className='col-sm-6'>
                    <span className='d-block h3'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</span>
                    <a className='d-block' href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                        {volunteer.v_email} 
                    </a>
                    <span className='d-block'><strong>Company: </strong>{volunteer.company}</span>
                    <span className='d-block'><strong>Title: </strong>{volunteer.title}</span>
                    <div className='row'>
                        <div className='col-sm-4'>Skills:</div>
                        <div className='col-sm-8'>
                            { volunteer.skills
                                ? volunteer.skills.map((skill, index) => <span className='d-block' key={skill+index}>{skill}</span>)
                                : null
                            }   
                        </div>
                    </div>
                </div>

                <div className='col-sm-12'>
                    <span className='d-block'><strong>LinkedIn: </strong>{volunteer.v_linkedin}</span>
                    <span className='d-block'><strong>Bio: </strong>{volunteer.v_bio}</span>
                </div>

                <div className='col-sm-12 d-flex flex-wrap justify-content-start'>
                    <strong className='d-block mx-2'>Interested in: </strong>
                    {
                        tasks.map((interest, index) => 
                            <span key={index + interest[0]} className='d-block mx-2'>
                                {interest[0]}
                            </span>
                        )          
                    }  
                </div>

                <div className='col-sm-12 d-flex flex-wrap justify-content-start'>
                    <strong className='d-block mx-2'>Mentoring: </strong>
                    {
                        mentees.map(mentee => 
                            <span key={mentee.f_id + mentee.f_first_name + mentee.f_lst_name} className='d-block mx-2'>
                                {mentee.f_first_name + ' ' + mentee.f_last_name}
                            </span>
                        )          
                    }

                    {
                        props.loggedUser && props.loggedUser.a_id
                        ? <button className='btn btn-primary'>Manage Mentoring</button>
                        : null
                    }
                </div>

                <div className='col-sm-12 d-flex flex-wrap justify-content-start'>
                    <strong className='d-block mx-2'>Events: </strong>
                    {
                        events.map(event => 
                            <span key={event.event_start + event.topic} className='d-block mx-2'>
                                {event.topic} ({new Date(event.event_start).toLocaleString()})
                            </span>
                        )          
                    }  
                </div>

            </div>
        </>
    )
}
