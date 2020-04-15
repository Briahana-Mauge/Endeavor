import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FellowProfilePage(props) {
    const { fellowId, setFeedback } = props;

    const [ fellow, setFellow ] = useState({});
    const [ events, setEvents ] = useState([]);
    const [ mentors, setMentors ] = useState([]);

    
    useEffect(() => {
        const getFellowData = async () => {
            try { 
                if (fellowId) {
                    const { data } = await axios.get(`/api/fellows/id/${fellowId}`);
                    setFellow(data.payload);
                    console.log(data.payload)
        
                    const promises = [];
                    promises.push(axios.get(`/api/mentor_pairs/fellow/${fellowId}`));
                    promises.push(axios.get(`/api/events/past/fellow/${fellowId}`));
                    const response = await Promise.all(promises);
    
                    setMentors(response[0].data.payload);
                    setEvents(response[1].data.payload);
                }
            } catch (err) {
                setFeedback(err);
            }
        }

        getFellowData();
    }, [fellowId, setFeedback])

    return (
        <>
            <div className='row'>
                {
                    fellow.deleted
                    ? <div className='col-12 bg-warning text-white text-center'>This fellow has left the platform</div>
                    : null
                }

                <div className='col-sm-6'>
                    <img 
                        className='d-block w-100'
                        src={fellow.v_picture} 
                        alt={`${fellow.v_first_name} ${fellow.v_last_name}`}
                    />
                    <span className='d-block'><strong>fellow Hours: </strong>{fellow.banked_time}</span>
                </div>

                <div className='col-sm-6'>
                    <span className='d-block h3'>{`${fellow.v_first_name} ${fellow.v_last_name}`}</span>
                    <a className='d-block' href={`mailto:${fellow.v_email}`} target='_blank' rel='noopener noreferrer'>
                        {fellow.v_email} 
                    </a>
                    <span className='d-block'><strong>Company: </strong>{fellow.company}</span>
                    <span className='d-block'><strong>Title: </strong>{fellow.title}</span>
                    <div className='row'>
                        <div className='col-sm-4'>Skills:</div>
                        <div className='col-sm-8'>
                            { fellow.skills
                                ? fellow.skills.map((skill, index) => <span className='d-block' key={skill+index}>{skill}</span>)
                                : null
                            }   
                        </div>
                    </div>
                </div>

                <div className='col-sm-12'>
                    <span className='d-block'><strong>LinkedIn: </strong>{fellow.v_linkedin}</span>
                    <span className='d-block'><strong>Bio: </strong>{fellow.v_bio}</span>
                </div>

                <div className='col-sm-12 d-flex flex-wrap justify-content-start'>
                    <strong className='d-block mx-2'>Interested in: </strong>
                    {/* {
                        tasks.map((interest, index) => 
                            <span key={index + interest[0]} className='d-block mx-2'>
                                {interest[0]}
                            </span>
                        )          
                    }   */}
                </div>

                <div className='col-sm-12 d-flex flex-wrap justify-content-start'>
                    <strong className='d-block mx-2'>Mentoring: </strong>
                    {
                        mentors.map(mentor => 
                            <span key={mentor.v_id + mentor.v_first_name + mentor.v_lst_name} className='d-block mx-2'>
                                {mentor.v_first_name + ' ' + mentor.v_last_name}
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
