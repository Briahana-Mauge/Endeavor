import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FellowProfilePage(props) {
    const { fellowId, setFeedback } = props;

    const [ fellow, setFellow ] = useState({});
    const [ events, setEvents ] = useState([]);
    const [ mentors, setMentors ] = useState([]);
    const [ cohort, setCohort ] = useState('');

    
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
                    promises.push(axios.get(`/api/cohorts/id/${data.payload.cohort_id}`));
                    const response = await Promise.all(promises);
    
                    setMentors(response[0].data.payload);
                    setEvents(response[1].data.payload);
                    setCohort(response[2].data.payload.cohort);
                    console.log('MENTORS: ', response[0].data.payload);
                    console.log('EVENTS: ', response[1].data.payload);
                    console.log('COHORT: ', response[2].data.payload.cohort);
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
                        src={fellow.f_picture} 
                        alt={`${fellow.f_first_name} ${fellow.f_last_name}`}
                    />
                </div>

                <div className='col-sm-6'>
                    <span className='d-block h3'>{`${fellow.f_first_name} ${fellow.f_last_name}`}</span>
                    <a className='d-block' href={`mailto:${fellow.f_email}`} target='_blank' rel='noopener noreferrer'>
                        {fellow.f_email} 
                    </a>
                    <span className='d-block'><strong>Cohort: </strong>{cohort}</span>
                    <div className='d-flex flex-wrap justify-content-start'>
                        <strong className='d-block mx-2'>Mentors: </strong>
                        {
                            mentors.map(mentor => 
                                <span key={mentor.v_id + mentor.v_first_name + mentor.v_lst_name} className='d-block mx-2'>
                                    <span className={mentor.m_active ? '' : 'text-muted'}>
                                        {mentor.v_first_name + ' ' + mentor.v_last_name}    
                                    </span>
                                </span>
                            )          
                        }

                        {
                            props.loggedUser && props.loggedUser.a_id
                            ? <button className='btn btn-primary'>Manage Mentoring</button>
                            : null
                        }
                    </div>
                </div>

                <div className='col-sm-12'>
                    <span className='d-block'><strong>LinkedIn: </strong>{fellow.f_linkedin}</span>
                    <span className='d-block'><strong>Github: </strong>{fellow.f_github}</span>
                    <span className='d-block'><strong>Bio: </strong>{fellow.f_bio}</span>
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
