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
                        ['Being a Personal Mentor', info.mentoring],
                        ['Being an Office Hours Mentor', info.office_hours],
                        ['Being a Professional Skills Coach', info.professional_skills_coach],
                        ['Administering Mock Behavioral Interviews', info.behavioral_mock_interview],
                        ['Administering Mock Technical Interviews', info.tech_mock_interview],
                        ['Being an Industry Speaker', info.industry_speaker],
                        ['Hosting a Fellows Site Visit at Your Company', info.hosting_site_visit]
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
                          {/* PICTURE & NAME */}
                          <img
                              className='g1ProfilePic'
                              src={volunteer.v_picture || '/images/default_pic.png'}
                              alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                          />
                          <h3 className='h3 mb-0'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</h3>

                          {/* CONTACT INFO, COMPANY, POSITION */}
                          <div className='card-text'>
                            <div className='g1ModalField'>
                              <i className='g1VolContact'><GrMail className="g1ReactIconsSvg" style={{ top: '-.75px', left: '1px' }} /></i>
                              <a href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                                  {volunteer.v_email}
                              </a>
                            </div>
                            {
                                volunteer.v_linkedin
                                    ? <div className='g1ModalField'>
                                        <i className='g1VolContact'><GrLinkedinOption className="g1ReactIconsSvg" style={{ top: '-2px', left: '1px' }} /></i>
                                        <a href={volunteer.v_linkedin} target='_blank' rel='noopener noreferrer'>
                                          {volunteer.v_linkedin}
                                        </a>
                                      </div>
                                    : null
                            }
                            <div className='g1ModalField'><i className='g1VolContact'>Company </i><span>{volunteer.company}</span></div>
                            <div className='g1ModalField'><i className='g1VolContact'>Position </i><span>{volunteer.title}</span></div>
                          </div>

                          <div className='card-text'>
                            {/* SKILLS */}
                            {
                                volunteer.skills && volunteer.skills.length
                                    // ?   <div className='row'>
                                    ?   <div className='g1ModalField' data-type='skills'>
                                          <i>Skills </i>
                                          <div>
                                            <span>
                                              ● { volunteer.skills.join(' ● ')}
                                            </span>
                                            {/* { volunteer.skills.map((skill, index) =>
                                                <span key={index + skill}>
                                                    {skill}
                                                </span>
                                            )} */}
                                          </div>
                                        </div>
                                    :   null
                            }

                            {/* INTERESTS */}
                            {
                                interests.length
                                    ?   <div className='g1ModalField' data-type='interests'>
                                          <i>Interested In </i>
                                          <div>
                                            { interests.map((interest, index) =>
                                                <span key={index + interest[0]}>
                                                    {interest[0]}
                                                </span>
                                            )}
                                          </div>
                                        </div>
                                    :   null
                            }
                          </div>

                          {/* BIO */}
                          {
                              volunteer.v_bio
                                  ? <div className='card-text'>
                                      <div className='g1ModalField' data-type='bio'>
                                        <i>Bio </i>
                                        <span>
                                          {volunteer.v_bio}
                                        </span>
                                      </div>
                                    </div>
                                  : null
                          }

                          {/* VOLUNTEER HOURS */}
                          <div className='card-text mb-4'>
                            <div className='g1ModalField' data-type='hours'><i>{volunteer.total_hours || 0} </i><span>Volunteer Hours</span></div>
                          </div>

                          {/* MENTORING SECTION */}
                          {
                              openToMentor
                                  ?   <>
                                        <hr />

                                        <div className='g1MentoringFlex card-text mb-4'>
                                          <div>
                                            <i className='g1MentorActiveLabel'>Active Mentor</i>
                                            {
                                                props.loggedUser && props.loggedUser.a_id
                                                ?   <button className='g1ManageMentorBtn btn btn-info'
                                                        data-dismiss='modal'
                                                        onClick={e => history.push(`/mentoring/volunteer/${volunteer.v_id}`)}
                                                    >
                                                        Manage Mentoring
                                                    </button>
                                                :   null
                                            }
                                          </div>
                                          {
                                              mentees.length
                                                  ? <>
                                                      <div className='g1ModalField' data-type='mentoring'>
                                                          <i>Current Mentees ▸ </i>
                                                      </div>
                                                      <span>
                                                        {
                                                            mentees.map(mentee =>
                                                                <Link
                                                                    key={mentee[0] + mentee[1] + mentee[2]}
                                                                    className='g1VolMentees'
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
                                                      </span>
                                                    </>
                                                  :   null
                                          }
                                        </div>
                                      </>
                                  : mentees.length
                                      ?   <><i>Past Mentor</i><br /></>
                                      :   null
                          }

                          <hr />

                          {/* PAST & UPCOMING EVENTS */}
                          <div className='g1VolModalEvents text-card mb-4'>
                              <i>Past Events </i>
                              {
                                pastEvents.length
                                  ? <ul className='plainUl'>
                                      {pastEvents.map(event => {
                                        return(
                                          <li className='mx-4'>
                                            <Link
                                                key={event[0] + event[1] + event[2]}
                                                to={`/event/${event[0]}`}
                                                target="_blank"
                                            >
                                                {`${event[1]} - ${new Date(event[2]).toLocaleDateString()} `}
                                            </Link>
                                            :: { event[4] ? <span> {event[4]} hours</span> : <span>Hours not assigned yet</span> }
                                            {/* <li key={event[0] + event[1] + event[2]} className='d-block mx-2'
                                                onClick={e => history.push(`event/${event[0]}`)}>
                                                {event[1]} ({new Date(event[2]).toLocaleDateString()}) -
                                                { event[4] ? <span> {event[4]} hours</span> : <span>Hours not assigned yet</span> }
                                            </li> */}
                                          </li>
                                        );

                                      })}
                                    </ul>
                                  : <em className='g1EmptyMsg mx-4'>No past volunteered events</em>
                              }

                          </div>

                          <div className='g1VolModalEvents text-card mb-4'>
                              <i>Current / Upcoming Events </i>
                              {
                                events.length
                                  ? <ul className='plainUl'>
                                      {events.map(event => {
                                        return(
                                          <li className='mx-4'>
                                            <Link
                                                key={event[0] + event[1] + event[2]}
                                                to={`/event/${event[0]}`}
                                                target="_blank"
                                            >
                                                {`${event[1]} - ${new Date(event[2]).toLocaleDateString()} `}
                                            </Link>
                                            {/* <span key={event[0] + event[1] + event[2]} className='d-block mx-2'
                                                onClick={e => history.push(`event/${event[0]}`)}>
                                                {event[1]} ({new Date(event[2]).toLocaleDateString()})
                                            </span> */}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  : <em className='g1EmptyMsg mx-4'>No upcoming volunteered events</em>
                              }
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
