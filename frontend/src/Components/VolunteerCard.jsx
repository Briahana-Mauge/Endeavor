import React from 'react';
import { useHistory } from 'react-router-dom';

import IconEmail from './IconEmail';


const VolunteerCard = (props) => {
    const history = useHistory();

    const viewProfile = () => {
        props.setDisplayTargetUser(true);
        props.setTargetVolunteerId(props.volunteer.v_id);
    }

    const shownSkills = [];
    let skillsPool = [...props.volunteer.skills];
    let duration = props.volunteer.skills.length > 3
        ? 3
        : props.volunteer.skills.length;
    for (let i = 0; i < duration; i++) {
        // eventually we'd rather have the volunteers rank their skills and display here the top 3 instead of random
        let selectedSkill = skillsPool.splice(Math.floor(Math.random() * skillsPool.length), 1)[0];
        switch (selectedSkill) {
            case 'Resumes, LinkedIn, and Cover Letters':
                shownSkills.push('Resumes, Cover Letters, LinkedIn');
                break;
            case 'Project Management: Roles, Tools, and Best Practices':
                shownSkills.push('Project Management');
                break;
            case 'Product Design, UX, and Prototyping':
                shownSkills.push('UX, Design, and Protoyping');
                break;
            case 'Talking About Tech Projects in Interviews':
                shownSkills.push('Interview Tech Talk');
                break;
            default:
                shownSkills.push(selectedSkill);
        }
    }
    const listSkills = shownSkills.map((skill, index) => <li key={index+skill}>{skill}</li>);
    if (props.volunteer.skills.length > 3) {
        listSkills.push(<li key='3msgOfMore' className='g1MoreItemsMsg'><i>+ {props.volunteer.skills.length - 3} more . . .</i></li>)
    }

    const listInterests = [];
    const interest = props.volunteer.interests;
    if (interest.mentoring) listInterests.push(<li key='m' className='g1Interest--Mentor'>M</li>);
    if (interest.office_hours) listInterests.push(<li key='hrs' className='g1Interest--OHours'>HRS</li>);
    if (interest.tech_mock_interview) listInterests.push(<li key='ti' className='g1Interest--TechInt'>TI</li>);
    if (interest.behavioral_mock_interview) listInterests.push(<li key='bi' className='g1Interest--BehaveInt'>BI</li>);
    if (interest.professional_skills_coach) listInterests.push(<li key='ps' className='g1Interest--ProSkills'>PS</li>);
    if (interest.hosting_site_visit) listInterests.push(<li key='sh' className='g1Interest--SiteHost'>SH</li>);
    if (interest.industry_speaker) listInterests.push(<li key='is' className='g1Interest--Speaker'>IS</li>);


    /* next event is an string containing the event id and topic, separated by ' &$%& '
        index0: event ID
        index1: event title / topic
    */
    let nextEvent = null;
    if (props.volunteer.next_event) {
        nextEvent = props.volunteer.next_event.split(' &$%& ');
    }

    return (
        <div className='g1VolResultCard px-1 py-2'>
            <div className='g1InnerVolResultCard'>
                <h4
                    className='g1VolResultCard__Name'
                    onClick={viewProfile}
                    data-toggle="modal"
                    data-target="#primaryModal"
                >
                    {props.volunteer.v_first_name} {props.volunteer.v_last_name}
                </h4>
                <IconEmail email={props.volunteer.v_email} className='g1VolResultCard__IconEmail' />
                <div className='g1VolResultCard__Job'>
                    {props.volunteer.company}<br />
                    {props.volunteer.title}
                </div>
                <img
                    className='g1VolResultCard__Avatar'
                    src={props.volunteer.v_picture || '/images/default_pic.png'}
                    alt={`${props.volunteer.v_first_name} ${props.volunteer.v_last_name}'s pic`}
                    onClick={viewProfile}
                    data-toggle="modal"
                    data-target="#primaryModal"
                />
                <ul className='g1VolResultCard__Interests'>
                    {listInterests}
                </ul>
                <ul className='g1VolResultCard__Skills'>
                    {listSkills}
                </ul>



                {   props.volunteer.next_event
                    ?   <>
                            <hr />
                            <div className='g1VolResultCard__NextEvent'>next event:<br />
                                <span style={{ cursor: 'pointer' }} onClick={e => history.push(`/event/${nextEvent[0]}`)}><strong>{nextEvent[1]}</strong></span>
                            </div>
                        </>
                    : null
                }
                {/* <div className='text-left mt-auto'>
                    <button className='btn btn-primary' onClick={viewProfile} data-toggle="modal" data-target="#primaryModal">See Profile</button>
                </div> */}
            </div>
        </div>
    );
}

export default VolunteerCard;
