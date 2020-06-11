import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GrMail, GrLinkedinOption } from 'react-icons/gr';
import axios from 'axios';

// import { PMBody, PMFooter } from '../Modals/PrimaryModal';
import Spinner from '../Spinner';

export default function VolunteerProfilePage(props) {
    const history = useHistory();
    const { volunteerId, setFeedback } = props;

    const [ volunteer, setVolunteer ] = useState({});
    const [ pastEvents, setPastEvents ] = useState([]);
    const [ events, setEvents ] = useState([]);
    const [ pastMentees, setPastMentees ] = useState([]);
    const [ currentMentees, setCurrentMentees ] = useState([]);
    const [ interests, setInterests ] = useState([]);
    const [ openToMentor, setOpenToMentor ] = useState(false);
    const [ profilePublic, setProfilePublic ] = useState(true);
    const [ waitingForData, setWaitingForData ] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const handleError = err => {
            if (isMounted && err.response && err.response.status === 404) {
                history.push('/404');
            } else if (isMounted) {
                setFeedback(err)
            }
        }

        const manageVolunteerInfo = info => {
            setVolunteer(info);
            setProfilePublic(!!info.v_id); 
            setWaitingForData(false);

            if (info.past_mentees) {
                setPastMentees(info.past_mentees);
            }

            if (info.current_mentees) {
                setCurrentMentees(info.current_mentees);
            }

            if (info.past_events) {
                const orderedEvents = info.past_events.sort((a, b) => new Date(b.eventStart).getTime() - new Date(a.eventStart).getTime());
                setPastEvents(orderedEvents);
            }

            if (info.future_events) {
                const orderedEvents = info.future_events.sort((a, b) => new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime());
                setEvents(orderedEvents);
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

        const getVolunteerData = () => {
            if (volunteerId) {
                if (!isNaN(parseInt(volunteerId)) && Number(volunteerId).toString() === volunteerId.toString()) {
                    axios.get(`/api/volunteers/id/${volunteerId}`)
                        .then(response => {
                            if (isMounted) {
                                manageVolunteerInfo(response.data.payload);
                            }
                        })
                        .catch(err => {
                            handleError(err);
                        });

                } else {
                    axios.get(`/api/volunteers/slug/${volunteerId}`)
                        .then(response => {
                            if (isMounted) {
                                manageVolunteerInfo(response.data.payload);
                            }
                        })
                        .catch(err => {
                            handleError(err);
                        });
                }
            }

        }
        getVolunteerData();

        //Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volunteerId]);

    if (waitingForData) {
        return <Spinner/>
    }

    return (
        <>
            {
                !profilePublic
                ? <h3 className='text-center'>Sorry, nothing to show</h3>
                : <>
                    {/* : <div className='row p-3'> */}
                    {/* <PMBody> */}
                        <div className='g1VolProfile col-12 p-0'>
                            {/* WARNINGS */}
                            {
                                volunteer.deleted
                                    ? <div className='g1ModalWarning card-text'>This volunteer has left the platform</div>
                                    : null
                            }

                            {/* PICTURE & NAME */}
                            <img
                                className='g1ProfilePic ml-sm-2 mb-2'
                                src={volunteer.v_picture || '/images/default_pic.png'}
                                alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}
                            />
                            <h3 className='h3 mb-0'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</h3>

                            {/* CONTACT INFO, COMPANY, POSITION */}
                            <div className='card-text' data-type='contactinfo'>
                                <div className='g1ModalField'>
                                    <i className='g1VolContact'><GrMail className="g1ReactIconsSvg" style={{ top: '-1.5px', left: '1px' }} /></i>
                                    <a href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                                        {volunteer.v_email}
                                    </a>
                                </div>
                                {
                                    volunteer.v_linkedin
                                        ? <div className='g1ModalField'>
                                            <i className='g1VolContact'><GrLinkedinOption className="g1ReactIconsSvg" style={{ top: '-3px', left: '1px' }} /></i>
                                            <a href={volunteer.v_linkedin} target='_blank' rel='noopener noreferrer'>
                                                {volunteer.v_linkedin}
                                            </a>
                                        </div>
                                        : null
                                }
                                <div className='g1ModalField'><i className='g1VolProfile__BlackLabel g1Black'>Company </i><span className='g1VolProfile__Company'>{volunteer.company}</span></div>
                                <div className='g1ModalField'><i className='g1VolProfile__BlackLabel g1Black'>Position </i><span>{volunteer.title}</span></div>
                            </div>

                            {/* SKILLS AND INTERESTS */}
                            <div className='card-text'>
                                {
                                    volunteer.skills && volunteer.skills.length
                                        // ?   <div className='row'>
                                        ? <div className='g1ModalField mb-4 mb-sm-0' data-type='skills'>
                                            <i className='g1VolProfile__BlackLabel'>Skills </i>
                                            <div>
                                                {volunteer.skills.map((skill, index) =>
                                                    <span key={index + skill} className='g1VolSkill'>
                                                        {` ● ${skill}`}
                                                    </span>
                                                )}
                                                {/* { volunteer.skills.map((skill, index) =>
                                            <span key={index + skill}>
                                                {skill}
                                            </span>
                                        )} */}
                                            </div>
                                        </div>
                                        : null
                                }

                                {
                                    interests.length
                                        ? <div className='g1ModalField' data-type='interests'>
                                            <i className='g1VolProfile__BlackLabel'>Interested In </i>
                                            <div>
                                                {interests.map((interest, index) =>
                                                    <span key={index + interest[0]}>
                                                        {interest[0]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        : null
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
                                <div className='g1ModalField' data-type='hours'><i className='g1VolProfile__BlackLabel'>Volunteer<br />Hours </i><span>{volunteer.total_hours || 0}</span></div>
                            </div>

                            {/* MENTORING SECTION */}
                            {
                                openToMentor
                                    ? <>
                                        <hr />
                                        <div className='g1MentoringFlex card-text mb-4'>
                                            <i className='g1MentorActiveLabel'>Active Mentor</i>
                                            {/* <div> */}
                                                {
                                                    props.loggedUser && props.loggedUser.a_id
                                                        ? <button className='g1ManageMentorBtn btn btn-info'
                                                            data-dismiss='modal'
                                                            onClick={e => history.push(`/mentoring/volunteer/${volunteer.v_id}`)}
                                                        >
                                                            Manage Mentoring
                                                </button>
                                                        : null
                                                }
                                            {/* </div> */}
                                            {
                                                currentMentees.length
                                                    ? <>
                                                        <div className='g1ModalField' data-type='mentoring'>
                                                            <i>Current Mentees ▸ </i>
                                                        </div>
                                                        <div className='g1MenteesList'>
                                                            {
                                                                currentMentees.map(mentee =>
                                                                    <Link
                                                                        key={mentee.fellowId + mentee.fellowName + mentee.startDate}
                                                                        className='g1VolMentees '
                                                                        to={`/fellow/${mentee.fellowId}`}
                                                                    >
                                                                        {mentee.fellowName}
                                                                    </Link>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </>
                                    : pastMentees.length || currentMentees.length
                                        ? <><i>Past Mentor</i><br /></>
                                        : null
                            }

                            <hr />

                            {/* PAST & UPCOMING EVENTS */}
                            <div className='g1VolModalEvents text-card mb-4'>
                                <i>Past Events </i>
                                {
                                    pastEvents.length
                                    ?   <ul className='plainUl'>
                                            {pastEvents.map(event => {
                                                return (
                                                    <li className='mx-4' key={event.eventId + event.topic + event.eventStart}>
                                                        <Link
                                                            to={`/event/${event.eventId}`}
                                                            className=''
                                                        >
                                                            {`${event.topic} - ${new Date(event.eventStart).toLocaleDateString()} `}
                                                        </Link>
                                                        : { event.volunteeredTime ? <span> {event.volunteeredTime} hours</span> : <span>Hours not assigned yet</span>}
                                                    </li>
                                                );

                                            })}
                                        </ul>
                                    :   <em className='g1EmptyMsg mx-4'>No past volunteered events</em>
                                }

                            </div>

                            <div className='g1VolModalEvents text-card mb-4'>
                                <i>Current / Upcoming Events </i>
                                {
                                    events.length
                                    ?   <ul className='plainUl'>
                                            {events.map(event => {
                                                return (
                                                    <li className='mx-4' key={event.eventId + event.topic + event.eventStart}>
                                                        <Link
                                                            to={`/event/${event.eventId}`}
                                                            className=''
                                                        >
                                                            {`${event.topic} - ${new Date(event.eventStart).toLocaleDateString()} `}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    :   <em className='g1EmptyMsg mx-4'>No upcoming volunteered events</em>
                                }
                            </div>
                        </div>
                    {/* </PMBody> */}
                    {/* <PMFooter className='g1NonAdminFooter' /> */}
                </>
            }
        </>
    )
}
