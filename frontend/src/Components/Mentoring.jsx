import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import Fellows from './Fellows';
import Spinner from './Spinner';

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
        <div className='row p-3'>
            {
                volunteer.deleted
                    ? <div className='col-12 bg-warning text-white text-center'>This volunteer has left the platform</div>
                    : null
            }

            <div className='col-sm-6'>
                <img
                    className='d-block imageIcon rounded-circle'
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
                <ul className='plainUl'> Skills:
                                    {volunteer.skills
                        ? volunteer.skills.map((skill, index) => <li className='ml-2' key={skill + index}>{skill}</li>)
                        : null
                    }
                </ul>
            </div>
        </div>


    const mentoringInfo =
        <>
            <div className='col-sm-12'>
                <strong className='d-block mx-2'>Mentoring: </strong>
                <ul className='plainUl'>
                    Active:
                        {
                            //   JSON_BUILD_OBJECT(
                            //     'fellowId', f_id,
                            //     'fellowName', f_first_name || ' ' || f_last_name,
                            //     'startDate', starting_date::Date,
                            //     'mentoringEnded', mentor_pairs.deleted
                            // )      
                            currentMentees.map(mentee =>
                                <li key={mentee.fellowId + mentee.fellowName + mentee.startDate} className='ml-3'>
                                    <button className='btn btn-danger btn-sm mr-2 mb-2' onClick={e => deleteMentee(mentee.fellowId)}>End Pairing</button>
                                    <span onClick={e => history.push(`/fellow/${mentee.fellowId}`)}>
                                        {mentee.fellowName}
                                    </span>: {new Date(mentee.startDate).toLocaleDateString()}
                                </li>
                            )
                        }
                    Ended:
                        {
                            pastMentees.map((mentee, index) =>
                                <li key={index + mentee.fellowId + mentee.fellowName + mentee.mentoringEnded} className='ml-3'>
                                    <span onClick={e => history.push(`/fellow/${mentee.fellowId}`)}>
                                        {mentee.fellowName}
                                    </span>: {new Date(mentee.startDate).toLocaleDateString()} - {new Date(mentee.mentoringEnded).toLocaleDateString()}
                                </li>
                            )
                    }
                </ul>

                {
                    props.loggedUser && props.loggedUser.a_id
                        ?   <button className='btn btn-primary d-block mb-2'
                                onClick={e => setShowFellowsList(true)}>
                                Add
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
        <>
            {volunteerInfo}
            {
                waitingForData
                    ? <> <Spinner className='mentoring' size={100} /> {mentoringInfo} </>
                    : <>{mentoringInfo}</>

            }
        </>
    )
}
