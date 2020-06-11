import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';

import Spinner from './Spinner';
import UIModule from './UIModule';
import Fellows from './Fellows';

export default function Mentoring(props) {
    const { volunteerId } = useParams();
    const history = useHistory();

    // Redirecting to 404 page not found if not a valid volunteer id
    if (!volunteerId || isNaN(parseInt(volunteerId)) || volunteerId.length !== parseInt(volunteerId).toString().length) {
        history.push('/404');
    }

    const { setFeedback } = props;
    const [volunteer, setVolunteer] = useState({});
    const [currentMentees, setCurrentMentees] = useState([]);
    const [pastMentees, setPastMentees] = useState([]);
    // const [ tasks, setTasks ] = useState([]);
    const [waitingForData, setWaitingForData] = useState(true);
    const [reload, setReload] = useState(false);
    const [showFellowsList, setShowFellowsList] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const getVolunteerData = (isMounted) => {
            setWaitingForData(true);
            axios.get(`/api/volunteers/id/${volunteerId}`)
                .then(response => {
                    if (isMounted) {
                        const vol = response.data.payload;
                        setVolunteer(vol);
                        setWaitingForData(false);

                        if (!vol.mentoring) { // Volunteer didn't sign up to be a mentor
                            history.push('/404');
                        }

                        if (vol.past_mentees) {
                            setPastMentees(vol.past_mentees);
                        }

                        if (vol.current_mentees) {
                            setCurrentMentees(vol.current_mentees);
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

        getVolunteerData(isMounted);

        // Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);


    const deleteMentee = async (fellowId) => {
        try {
            await axios.delete(`/api/mentor_pairs/volunteer/${volunteer.v_id}/fellow/${fellowId}`);
            setReload(!reload);
        } catch (err) {
            setFeedback(err);
        }
    }
    const volunteerInfo =
        <div className='g1MentoringMgr p-3'>
            {
                volunteer.deleted
                    ? <div className='bg-warning text-white text-center'>This volunteer has left the platform</div>
                    : null
            }

            <img
                className='g1MentoringMgr__Avatar'
                src={volunteer.v_picture || '/images/default_pic.png'}
                alt={`${volunteer.v_first_name} ${volunteer.v_last_name}`}
            />
            <div><b>Volunteered Hours </b>{volunteer.total_hours}</div>

            <div className='d-block h3'>{`${volunteer.v_first_name} ${volunteer.v_last_name}`}</div>
            <a href={`mailto:${volunteer.v_email}`} target='_blank' rel='noopener noreferrer'>
                {volunteer.v_email}
            </a>
            <div><b>Company </b>{volunteer.company}</div>
            <div><b>Position </b>{volunteer.title}</div>
            <div className='g1MentoringMgr__Skills'>
                <b>Skills</b>
                <ul>
                    {volunteer.skills
                        ? volunteer.skills.map((skill, index) => <li className='' key={skill + index}>{skill}</li>)
                        : null
                    }
                </ul>
            </div>
        </div>


    const mentoringInfo =
    <>
        <div className='g1MentoringMgr'>
            <div><b>Mentoring</b></div>
            {   
                currentMentees.length
                    ?   <>
                            <div className='g1MentoringMgr__TypeLabel'>Active</div>
                            <ul>
                                {currentMentees.map(mentee =>
                                    <li key={mentee.fellowId + mentee.fellowName + mentee.startDate} className='ml-3'>
                                        <button className='btn btn-danger btn-sm mr-2 mb-2' onClick={e => deleteMentee(mentee.fellowId)}>End Pairing</button>
                                        <Link to={`/fellow/${mentee.fellowId}`} className='plainLink'>
                                            {mentee.fellowName}
                                        </Link>: {new Date(mentee.startDate).toLocaleDateString()}
                                    </li>
                                )}
                            </ul>
                        </>
                    :   <div className='g1MentoringMgr__TypeLabel'>No active mentorings</div>
            }
            {
                pastMentees.length
                    ?   <>
                            <div className='g1MentoringMgr__TypeLabel'>Past</div>
                            <ul>
                                {pastMentees.map((mentee, index) =>
                                    <li key={index + mentee.fellowId + mentee.fellowName + mentee.mentoringEnded} className='ml-3'>
                                        <Link to={`/fellow/${mentee.fellowId}`} className='plainLink'>
                                            {mentee.fellowName}
                                        </Link>: {new Date(mentee.startDate).toLocaleDateString()} - {new Date(mentee.mentoringEnded).toLocaleDateString()}
                                    </li>
                                )}
                            </ul>
                        </>
                    :   null
            }


                {
                    props.loggedUser && props.loggedUser.a_id
                        ?   showFellowsList
                                ?   <button className='btn btn-danger mb-2'
                                        onClick={e => setShowFellowsList(false)}
                                    >
                                        Close
                                    </button> 
                                :   <button className='btn btn-success mb-2'
                                        onClick={e => setShowFellowsList(true)}
                                    >
                                        Assign Mentees
                                    </button>
                        :   null
                }
                </div>
            {
                showFellowsList
                    ? <Fellows
                        setFeedback={setFeedback}
                        volunteer={volunteer}
                        reload={reload}
                        setReload={setReload}
                        setShowFellowsList={setShowFellowsList}
                    />
                    : null
            }

        </>


    return (
        <UIModule className='lodeStone' titleColor="" titleRegular=''>
            {volunteerInfo}
            {
                waitingForData
                    ? <> <Spinner className='mentoring' size={100} /> {mentoringInfo} </>
                    : <>{mentoringInfo}</>

            }
        </UIModule>
    )
}
