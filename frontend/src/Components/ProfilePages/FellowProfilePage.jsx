import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function FellowProfilePage(props) {
    const history = useHistory();
    const { fellowId, setFeedback } = props;

    const [ fellow, setFellow ] = useState({});
    const [ events, setEvents ] = useState([]);
    const [ activeMentors, SetActiveMentors ] = useState([]);
    const [ pastMentors, setPastMentors ] = useState([]);

    
    useEffect(() => {
        const getFellowData = async () => {
            try { 
                if (fellowId) {
                    const { data } = await axios.get(`/api/fellows/id/${fellowId}`);
                    setFellow(data.payload);

                    if (data.payload.mentors_list) {
                        const active = [];
                        const past = [];
                        data.payload.mentors_list.forEach(mentor => {
                            /* After splitting, for each mentee we will have:
                                index0: mentor id
                                index1: full name
                                index2: When the mentoring relation started
                                index3: text for relation deleted: date means relation ended, false it's still on
                            */
                            const mentorArr = mentor.split(' &$%& ');
                            if (mentorArr[3] === 'false') {
                                active.push(mentorArr);
                            } else {
                                past.push(mentorArr);
                            }
                        });
    
                        SetActiveMentors(active);
                        setPastMentors(past);
                    }

                    if (data.payload.events_list) {
                        const eventsList = data.payload.events_list.map(event => event.split(' &$%& '));
                        /* After splitting, for each mentee we will have:
                            index0: event id
                            index1: event topic/title
                            index2: event start
                            index3: event end
                        */
                        setEvents(eventsList);
                    }
        
                    // const promises = [];
                    // promises.push(axios.get(`/api/mentor_pairs/fellow/${fellowId}`));
                    // promises.push(axios.get(`/api/events/past/fellow/${fellowId}`));
                    // promises.push(axios.get(`/api/cohorts/id/${data.payload.cohort_id}`));
                    // const response = await Promise.all(promises);
    
                    // setMentors(response[0].data.payload);
                    // setEvents(response[1].data.payload);
                    // setCohort(response[2].data.payload.cohort);
                }
            } catch (err) {
                setFeedback(err);
            }
        }

        getFellowData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fellowId])

    return (
        <>
            <div className='row'>
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
                        { activeMentors.map(mentor => <li className='ml-3' key={mentor[0] + mentor[1]}>
                                <span onClick={e => history.push(`/volunteer/${mentor[0]}`)}>{mentor[1]}</span>
                                : {new Date(mentor[2]).toLocaleDateString()}
                            </li>) }
                    </ul>
                    <ul className='plainUl'> <strong>Past Mentor(s):</strong>
                        { pastMentors.map((mentor, index) => <li className='ml-3' key={mentor[0] + mentor[1] + index}>
                                <span onClick={e => history.push(`/volunteer/${mentor[0]}`)}>{mentor[1]}</span>
                                : {new Date(mentor[2]).toLocaleDateString()} - {new Date(mentor[3]).toLocaleDateString()}
                            </li>) }
                    </ul>

                    <ul className='plainUl'> <strong className='d-block mx-2'>Events: </strong>
                        {
                            events.map(event => 
                                <li key={event[2] + event[1] + event[0]} className='ml-3'>
                                    <span>{event[1]}</span> 
                                    : ({new Date(event[2]).toLocaleDateString()})
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
        </>
    )
}
