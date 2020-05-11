import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function VolunteerProfilePage(props) {
    const history = useHistory();
    const { volunteerId, setFeedback } = props;

    const [ volunteer, setVolunteer ] = useState({});
    const [ pastEvents, setPastEvents ] = useState([]);
    const [ events, setEvents ] = useState([]);
    const [ mentees, setMentees ] = useState([]);
    const [ tasks, setTasks ] = useState([]);
    const [ openToMentor, setOpenToMentor ] = useState(false);
    const [ profilePublic, setProfilePublic ] = useState(true);
    const [ waitingForData, setWaitingForData ] = useState(true);

    useEffect(() => {
        const getVolunteerData = async () => {
            try { 
                if (volunteerId) {
                    const { data } = await axios.get(`/api/volunteers/id/${volunteerId}`);
                    setVolunteer(data.payload);
                    setProfilePublic(data.payload.v_id);
                    setWaitingForData(false);

                    if (data.payload.mentees) {
                        const tracker = {}
                        data.payload.mentees.forEach(mentee => {
                            /* After splitting, for each mentee we will have:
                                index0: mentee id
                                index1: full name
                                index2: When the mentoring relation started
                                index3: text for relation deleted: true relation ended, false it's still on
                            */
                            const menteeArr = mentee.split(' &$%& ');
                            if (menteeArr[3] === 'false') {
                                tracker[menteeArr[0]] = menteeArr;
                            } else if (!tracker[menteeArr[0]]) {
                                tracker[menteeArr[0]] = menteeArr;
                            }
                        });
                        setMentees(Object.values(tracker));
                    }

                    if (data.payload.past_events) {
                        const parsedEvents = data.payload.past_events.map(event => event.split(' &$%& '));
                        /* After splitting, for each event we will have:
                            index0: event id
                            index1: event topic
                            index2: event start date
                            index3: event end date
                            index4: volunteered time for tht event
                        */
                        const a = parsedEvents.sort((a, b) => b[3] - a[3]); // Sorting with end date 
                        setPastEvents(a);
                    }

                    if (data.payload.future_events) {
                        const parsedEvents = data.payload.future_events.map(event => event.split(' &$%& '));
                        /* After splitting, for each event we will have:
                            index0: event id
                            index1: event topic
                            index2: event start date
                            index3: event end date
                        */
                        const a = parsedEvents.sort((a, b) => a[3] - b[3]); // Sorting with end date 
                        setEvents(a);
                    }
                    
                    setTasks([
                        ['mentoring', data.payload.mentoring], 
                        ['being an Office Hours mentor', data.payload.office_hours], 
                        ['administering mock technical interviews', data.payload.tech_mock_interview], 
                        ['behavioral interviewing', data.payload.behavioral_mock_interview], 
                        ['being a professional skills coach', data.payload.professional_skills_coach],
                        ['hosting a Site Visit at your office', data.payload.hosting_site_visit],
                        ['being an Industry Speaker', data.payload.industry_speaker]
                    ].filter(task => task[1]));

                    setOpenToMentor(data.payload.mentoring);

                }
            } catch (err) {
                setFeedback(err);
            }
        }

        getVolunteerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volunteerId]);

    return (
        <>
            {
                waitingForData
                ?   null // OR it can be a spinner 
                :   !profilePublic 
                    ? <h3 className='text-center'>Sorry, nothing to show</h3>
                    : <div className='row p-3'>
                        {
                            volunteer.deleted
                            ? <div className='col-12 bg-warning text-white text-center'>This volunteer has left the platform</div>
                            : null
                        }

                        <div className='col-sm-6'>
                            <img 
                                className='d-block w-100'
                                src={volunteer.v_picture || '/images/default_pic.png'} 
                                alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                            />
                            <span className='d-block'><strong>Volunteered Hours: </strong>{volunteer.total_hours}</span>
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

                            <div className='d-flex flex-wrap justify-content-start'>
                                <strong className='d-block mx-2'>Mentoring: </strong>
                                {
                                    mentees.map(mentee => 
                                        <span key={mentee[0] + mentee[1] + mentee[2]} className='d-block mx-2' 
                                            onClick={e => history.push(`/fellow/${mentee[0]}`)}>
                                            {mentee[1]}
                                        </span>
                                    )          
                                }

                                {
                                    props.loggedUser && props.loggedUser.a_id && openToMentor
                                    ?   <button className='btn btn-primary' 
                                            onClick={e => history.push(`/mentoring/volunteer/${volunteer.v_id}`)}>
                                            Manage Mentoring
                                        </button>
                                    : null
                                }
                            </div>

                            <div className='row'>
                                <ul className='plainUl col-sm-6'><strong>Past Events: </strong>
                                {
                                    pastEvents.map(event => 
                                        <li key={event[0] + event[1] + event[2]} className='d-block mx-2'
                                            onClick={e => history.push(`event/${event[0]}`)}>
                                            {event[1]} ({new Date(event[2]).toLocaleDateString()}) - 
                                            { event[4] ? <span> {event[4]} hours</span> : <span>Hours not assigned yet</span> }
                                        </li>
                                    )          
                                } 
                                </ul>
                                <ul className='plainUl col-sm-6'><strong>Current / Upcoming Events: </strong>
                                {
                                    events.map(event => 
                                        <span key={event[0] + event[1] + event[2]} className='d-block mx-2'
                                            onClick={e => history.push(`event/${event[0]}`)}>
                                            {event[1]} ({new Date(event[2]).toLocaleDateString()})
                                        </span>
                                    )          
                                }
                                </ul> 
                            </div>
                        </div>
                    </div>
            }

        </>
    )
}
