import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { GrMail, GrLinkedinOption } from 'react-icons/gr';

import { PMBody, PMFooter } from '../Modals/PrimaryModal';

export default function VolunteerProfilePage(props) {
    const history = useHistory();
    const { volunteerId, setFeedback } = props;

    const [ volunteer, setVolunteer ] = useState({});
    const [ pastEvents, setPastEvents ] = useState([]);
    const [ events, setEvents ] = useState([]);
    const [ mentees, setMentees ] = useState([]);
    const [ interests, setInterests ] = useState([]);
    const [ openToMentor, setOpenToMentor ] = useState(false);
    const [ profilePublic, setProfilePublic ] = useState(true);
    const [ waitingForData, setWaitingForData ] = useState(true);

    useEffect(() => {
        const getVolunteerData = async () => {
            try { 
                if (volunteerId) {
                    let response = {data: {payload: null}};
                    if (!isNaN(parseInt(volunteerId)) && Number(volunteerId).toString() === volunteerId.toString()) {
                        response = await axios.get(`/api/volunteers/id/${volunteerId}`);
                    } else {
                        response = await axios.get(`/api/volunteers/slug/${volunteerId}`);
                    }
                    const info = response.data.payload;
                    setVolunteer(info);
                    setProfilePublic(!!info.v_id);
                    setWaitingForData(false);

                    if (info.mentees) {
                        const tracker = {}
                        info.mentees.forEach(mentee => {
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

                    if (info.past_events) {
                        const parsedEvents = info.past_events.map(event => event.split(' &$%& '));
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

                    if (info.future_events) {
                        const parsedEvents = info.future_events.map(event => event.split(' &$%& '));
                        /* After splitting, for each event we will have:
                            index0: event id
                            index1: event topic
                            index2: event start date
                            index3: event end date
                        */
                        const a = parsedEvents.sort((a, b) => a[3] - b[3]); // Sorting with end date 
                        setEvents(a);
                    }
                    
                    setInterests([
                        ['Personal Mentoring', info.mentoring],
                        ['Being an Office Hours Mentor', info.office_hours],
                        ['Administering Practice Technical Interviews', info.tech_mock_interview],
                        ['Administering Practice Behavioral Interviews', info.behavioral_mock_interview],
                        ['Being a Professional Skills Coach', info.professional_skills_coach],
                        ['Hosting a Fellows Site Visit at Your Company', info.hosting_site_visit],
                        ['Being an Industry Speaker', info.industry_speaker]
                    ].filter(task => task[1]));

                    setOpenToMentor(info.mentoring);

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
              ? null // OR it can be a spinner
              : !profilePublic
                ? <h3 className='text-center'>Sorry, nothing to show</h3>
                : <>
                {/* : <div className='row p-3'> */}
                    <PMBody>
                      {
                          volunteer.deleted
                          ? <div className='col-12 bg-warning text-white text-center'>This volunteer has left the platform</div>
                          : null
                      }

                      <div className='col-12'>
                          <img
                              className='g1ProfilePic d-block'
                              src={volunteer.v_picture || '/images/default_pic.png'}
                              alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                          />

                          <span className='d-block h3 mb-0'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</span>
                          <a className='d-block' href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                              {volunteer.v_email}
                          </a>
                          {
                              volunteer.v_linkedin
                                  ? <span className='d-block'><strong>LinkedIn: </strong>{volunteer.v_linkedin}</span>
                                  : null
                          }

                          <span className='d-block'><strong>Company: </strong>{volunteer.company}</span>
                          <span className='d-block'><strong>Title: </strong>{volunteer.title}</span>

                          <span className='d-block mb-3'><strong>Volunteered Hours: </strong>{volunteer.total_hours}</span>

                          {
                              volunteer.skills && volunteer.skills.length
                                  ?   <div className='row'>
                                          <div className='col'><strong>Skills: </strong></div>
                                          <div className='col'>
                                              {volunteer.skills.map((skill, index) => <span className='d-block' key={skill+index}>{skill}</span>)}
                                          </div>
                                      </div>
                                  :   null
                          }

                          {
                              volunteer.v_bio
                                  ? <span className='d-block'><strong>Bio: </strong>{volunteer.v_bio}</span>
                                  : null
                          }

                          {
                              interests.length
                                  ?   <div className='col-sm-12 d-flex flex-wrap justify-content-start'>
                                          <strong className='d-block mx-2'>Interested in: </strong>
                                          { interests.map((interest, index) =>
                                              <span key={index + interest[0]} className='d-block mx-2'>
                                                  {interest[0]}
                                              </span>
                                          )}
                                      </div>
                                  :   null
                          }

                          {
                              openToMentor
                                  ?   <>
                                          <strong>Active Mentor</strong><br />
                                          {
                                              props.loggedUser && props.loggedUser.a_id
                                              ?   <button className='btn btn-info'
                                                      data-dismiss='modal'
                                                      onClick={e => history.push(`/mentoring/volunteer/${volunteer.v_id}`)}
                                                  >
                                                      Manage Mentoring
                                                  </button>
                                              :   null
                                          }
                                          {
                                              mentees.length
                                                  ?   <div className='d-flex flex-wrap justify-content-start'>
                                                          <strong className='d-block mx-2'>Currently mentoring: </strong>
                                                          {
                                                              mentees.map(mentee =>
                                                                  <Link
                                                                      key={mentee[0] + mentee[1] + mentee[2]}
                                                                      className='d-block mx-2'
                                                                      to={`/fellow/${mentee[0]}`}
                                                                      target="_blank"
                                                                  >
                                                                      {mentee[1]}
                                                                  </Link>
                                                                  // <span key={mentee[0] + mentee[1] + mentee[2]} className='d-block mx-2'
                                                                  //     data-dismiss='modal'
                                                                  //     onClick={e => history.push(`/fellow/${mentee[0]}`)}>
                                                                  //     {mentee[1]}
                                                                  // </span>
                                                              )
                                                          }
                                                      </div>
                                                  :   null
                                          }
                                      </>
                                  :   mentees.length
                                          ?   <><strong>Past Mentor</strong><br /></>
                                          :   null
                          }

                          <div className='row'>
                              <ul className='plainUl col-sm-6'><strong>Past Events: </strong>
                              {
                                  pastEvents.map(event =>
                                      <Link
                                          key={event[0] + event[1] + event[2]}
                                          className='d-block mx-2'
                                          to={`/event/${event[0]}`}
                                          target="_blank"
                                      >
                                          {event[1]} ({new Date(event[2]).toLocaleDateString()}) -
                                          { event[4] ? <span> {event[4]} hours</span> : <span>Hours not assigned yet</span> }
                                      </Link>
                                      // <li key={event[0] + event[1] + event[2]} className='d-block mx-2'
                                      //     onClick={e => history.push(`event/${event[0]}`)}>
                                      //     {event[1]} ({new Date(event[2]).toLocaleDateString()}) -
                                      //     { event[4] ? <span> {event[4]} hours</span> : <span>Hours not assigned yet</span> }
                                      // </li>
                                  )
                              }
                              </ul>
                              <ul className='plainUl col-sm-6'><strong>Current / Upcoming Events: </strong>
                              {
                                  events.map(event =>
                                      <Link
                                          key={event[0] + event[1] + event[2]}
                                          className='d-block mx-2'
                                          to={`/event/${event[0]}`}
                                          target="_blank"
                                      >
                                          {event[1]} ({new Date(event[2]).toLocaleDateString()})
                                      </Link>
                                      // <span key={event[0] + event[1] + event[2]} className='d-block mx-2'
                                      //     onClick={e => history.push(`event/${event[0]}`)}>
                                      //     {event[1]} ({new Date(event[2]).toLocaleDateString()})
                                      // </span>
                                  )
                              }
                              </ul>
                          </div>
                      </div>
                  </PMBody>
                  <PMFooter className='g1NonAdminFooter' />
              </>
              // </div>
          }
        </>
    )
}
