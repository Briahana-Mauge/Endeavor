import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';


export default function FellowPreviewCard(props) {
    const history = useHistory();

    const { fellow } = props;
    
    const [ activeMentors, setActiveMentors ] = useState([]);
    const [ pastMentors, setPastMentors ] = useState([]);

    useEffect(() => {
        if (fellow.mentors_list) {
            const active = [];
            const pastTracker = {};
            fellow.mentors_list.forEach(mentor => {
                /* After splitting, for each mentor we will have:
                    index0: mentor id
                    index1: full name
                    index2: when the mentoring relation started
                    index3: text for relation deleted: date means relation ended, false it's still on
                */
                const mentorArr = mentor.split(' &$%& ');
                if (mentorArr[3] === 'false') {
                    active.push([mentorArr[0], mentorArr[1]]);
                } else {
                    pastTracker[mentorArr[1]] = [mentorArr[0], mentorArr[1]];
                }
            });

            setActiveMentors(active);
            setPastMentors(Object.values(pastTracker));
        }
    }, [fellow])

    const viewProfile = () => {
        props.setDisplayTargetUser(true);
        props.setTargetFellowId(fellow.f_id);
    }


    return (
        <div className='row mb-1 border rounded-lg'>
            {
                fellow.want_mentor
                ?   <button className='btn btn-primary btn-block my-1 mx-3' onClick={e => props.pairFellow(fellow.f_id)}>Pair</button>
                :   <button className='btn btn-warning btn-block my-1 mx-3' onClick={e => props.pairFellow(fellow.f_id)}>Pair</button>
            }
            
            <div className='col-sm-6'>
                <img className='d-block rounded-circle imageIcon' src={fellow.f_picture || '/images/default_pic.png'} alt={`${fellow.f_first_name} ${fellow.f_last_name}`}/>
                <strong className='d-block'>{`${fellow.f_first_name} ${fellow.f_last_name}`}</strong>
                <a className='d-block' href={`mailto:${fellow.f_email}`}>
                {/* <a className='d-block' href={`mailto:${fellow.f_email}`} target='_blank' rel='noopener noreferrer'> */}
                    {fellow.f_email} 
                </a>
                <p>Cohort: {fellow.cohort}</p>
            </div>

            <div className='col-sm-6'>
                <ul className='plainUl'> <strong>Active Mentor(s):</strong>
                    { activeMentors.map(mentor => <li key={mentor[0] + mentor[1]}>
                            <span onClick={e => history.push(`/volunteer/${mentor[0]}`)}>{mentor[1]}</span>
                        </li>) }
                </ul>
                <ul className='plainUl'> <strong>Past Mentor(s):</strong>
                    { pastMentors.map(mentor => <li key={mentor[0] + mentor[1]}>
                            <span onClick={e => history.push(`/volunteer/${mentor[0]}`)}>{mentor[1]}</span>
                        </li>) }
                </ul>

                <div className='text-right'>
                    <button className='btn btn-primary' onClick={viewProfile}>See Profile</button>
                </div>
            </div>
        </div>
    )
}