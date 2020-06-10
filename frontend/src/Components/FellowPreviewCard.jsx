import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';


export default function FellowPreviewCard(props) {
    const history = useHistory();

    const { fellow } = props;
    
    const [ activeMentors, setActiveMentors ] = useState([]);
    const [ pastMentors, setPastMentors ] = useState([]);

    useEffect(() => {
        if (fellow.mentors_list) {
            setActiveMentors(fellow.mentors_list);
        }

        if (fellow.past_mentors_list) {
            setPastMentors(fellow.past_mentors_list);
        }

    }, [fellow])


    return (
        <div className='row mb-1 border rounded-lg' style={{minHeight: '320px'}}>
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
                    { activeMentors.map(mentor => <li key={mentor.volunteerId + mentor.name}>
                            <span onClick={e => history.push(`/volunteer/${mentor.volunteerId}`)}>{mentor.name}</span>
                        </li>) }
                </ul>
                <ul className='plainUl'> <strong>Past Mentor(s):</strong>
                    { pastMentors.map(mentor => <li key={mentor.volunteerId + mentor.name}>
                            <span onClick={e => history.push(`/volunteer/${mentor.volunteerId}`)}>{mentor.name}</span>
                        </li>) }
                </ul>

                <div className='text-right'>
                    <Link className='btn btn-primary' to={`/fellow/${fellow.f_id}`}>See Profile</Link>
                </div>
            </div>
        </div>
    )
}