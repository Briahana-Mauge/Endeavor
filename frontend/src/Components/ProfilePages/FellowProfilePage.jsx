import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

export default function FellowProfilePage(props) {
    const history = useHistory();
    const { fellowId, setFeedback } = props;

    const [ fellow, setFellow ] = useState({});
    const [ events, setEvents ] = useState([]);
    const [ activeMentors, SetActiveMentors ] = useState([]);
    const [ pastMentors, setPastMentors ] = useState([]);
    const [ loading, setLoading ] = useState(true);


    
    useEffect(() => {
        let isMounted = true;

        const getFellowData = () => {
            if (fellowId) {
                axios.get(`/api/fellows/id/${fellowId}`)
                    .then(response => {
                        if (isMounted) {
                            const fel = response.data.payload;
                            setFellow(fel);
                            setLoading(false);
            
                            if (fel.past_mentors_list) {
                                setPastMentors(fel.past_mentors_list);
                            }

                            if (fel.mentors_list) {
                                SetActiveMentors(fel.mentors_list);
                            }
            
                            if (fel.events_list) {
                                setEvents(fel.events_list);
                            }
                        }
                    })
                    .catch(err => {
                        if (isMounted && err.response && err.response.status === 404) {
                            history.push('/404');
                        } else if (isMounted) {
                            setFeedback(err)
                        }
                    })
            }
        }
        getFellowData();
        
        //Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fellowId]);

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className='row' style={{color: 'var(--color-black)'}}>
            {
                fellow.fellow_deleted
                ? <div className='col-12 bg-warning text-white text-center'>This fellow has left the platform</div>
                : null
            }

            <div className='col-sm-6'>
                <img 
                    className='d-block w-100'
                    src={fellow.f_picture || '/images/default_pic.png'} 
                    alt={`${fellow.f_first_name} ${fellow.f_last_name}`}
                />
            </div>

            <div className='col-sm-6'>
                <span className='d-block h3'>{`${fellow.f_first_name} ${fellow.f_last_name}`}</span>
                <a className='d-block' href={`mailto:${fellow.f_email}`} target='_blank' rel='noopener noreferrer'>
                    {fellow.f_email} 
                </a>
                <span className='d-block'><strong>Cohort: </strong>{fellow.cohort}</span>
                <ul className='plainUl'> <strong>Active Mentor(s):</strong>
                    { activeMentors.map(mentor => <li className='ml-3' key={mentor.volunteerId + mentor.name}>
                            <Link to={`/volunteer/${mentor.volunteerId}`} className='plainLink'>{mentor.name}</Link>
                            : {new Date(mentor.startDate).toLocaleDateString()}
                        </li>) }
                </ul>
                <ul className='plainUl'> <strong>Past Mentor(s):</strong>
                    { pastMentors.map((mentor, index) => <li className='ml-3' key={mentor.volunteerId + mentor.name + index}>
                            <Link to={`/volunteer/${mentor.volunteerId}`} className='plainLink'>{mentor.name}</Link>
                            : {new Date(mentor.startDate).toLocaleDateString()} - {new Date(mentor.endDate).toLocaleDateString()}
                        </li>) }
                </ul>

                <ul className='plainUl'> <strong className='d-block mx-2'>Events: </strong>
                    {
                        events.map(event => 
                            <li to={`/event/${event.eventId}`} key={event.eventStart + event.topic + event.eventId} className='ml-3'>
                                <Link to={`/event/${event.eventId}`} className='plainLink'>{event.topic}</Link> 
                                : ({new Date(event.eventStart).toLocaleDateString()})
                            </li>
                        )          
                    }  
                </ul>

                {/* {
                    props.loggedUser && props.loggedUser.a_id
                    ? <button className='btn btn-primary'>Manage Mentoring</button>
                    : null
                } */}
            </div>

            <div className='col-sm-12'>
                <span className='d-block'><strong>LinkedIn: </strong>{fellow.f_linkedin}</span>
                <span className='d-block'><strong>Github: </strong>{fellow.f_github}</span>
                <span className='d-block'><strong>Bio: </strong>{fellow.f_bio}</span>
            </div>

        </div>
    )
}
