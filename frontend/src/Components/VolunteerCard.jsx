import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import IconEmail from './IconEmail';


const VolunteerCard = (props) => {
    const { volunteer } = props;

    const [ listSkills, setListSkills ] = useState([]);

    useEffect(() => {
        const shownSkills = [];
        const skillsPool = [...volunteer.skills];
        const duration = Math.min(volunteer.skills.length, 3);
    
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

        const listOfSkills = shownSkills.map((skill, index) => <li key={index+skill}>{skill}</li>);
        if (volunteer.skills.length > 3) {
            listOfSkills.push(<li key='3msgOfMore' className='g1MoreItemsMsg'>+{volunteer.skills.length - 3} more skills . . .</li>)
        }

        setListSkills(listOfSkills)

    }, [volunteer.skills])

    const listInterests = [];
    const interest = volunteer.interests;
    if (interest.mentoring) listInterests.push(
        <li key='m' className='g1Interest--Mentor' data-tooltip='MENTORING'>M</li>);
    if (interest.office_hours) listInterests.push(
        <li key='hrs' className='g1Interest--OHours' data-tooltip='OFFICE HOURS'>HRS</li>);
    if (interest.tech_mock_interview) listInterests.push(
        <li key='ti' className='g1Interest--TechInt' data-tooltip='TECHNICAL INTERVIEWING'>TI</li>);
    if (interest.behavioral_mock_interview) listInterests.push(
        <li key='bi' className='g1Interest--BehaveInt' data-tooltip='BEHAVIORAL INTERVIEWING'>BI</li>);
    if (interest.professional_skills_coach) listInterests.push(
        <li key='ps' className='g1Interest--ProSkills' data-tooltip='PROFESSIONAL SKILLS'>PS</li>);
    if (interest.hosting_site_visit) listInterests.push(
        <li key='sh' className='g1Interest--SiteHost' data-tooltip='SITE HOSTING'>SH</li>);
    if (interest.industry_speaker) listInterests.push(
        <li key='is' className='g1Interest--Speaker' data-tooltip='INDUSTRY SPEAKER'>IS</li>);


    const nextEvent = volunteer.next_event;

    return (
        <div className='g1VolResultCard px-1'>
            <div className='g1InnerVolResultCard'>
                <Link to={`/volunteer/${volunteer.v_id}`} className='g1VolResultCard__AvatarLink'>
                    <img
                        className='g1VolResultCard__Avatar'
                        src={volunteer.v_picture || '/images/default_pic.png'}
                        alt={`${volunteer.v_first_name} ${volunteer.v_last_name}'s pic`}
                    />
                </Link>
                <Link to={`/volunteer/${volunteer.v_id}`} className='g1VolResultCard__NameLink'>
                    <h4>
                        {volunteer.v_first_name} {volunteer.v_last_name}
                    </h4>
                </Link>
                <div className='g1VolResultCard__IconsBar'>
                    <IconEmail email={volunteer.v_email} className='g1VolResultCard__IconEmail' />
                    <span className='g1VolResultCard__IconCheckbox'>
                        <input 
                            className='form-check-input' 
                            type='checkbox' 
                            value={volunteer.v_email}
                            checked={props.volunteersList[volunteer.v_email] || false}
                            onChange={e => props.manageVolunteersList(volunteer.v_email, volunteer.v_first_name, volunteer.v_last_name)}
                        />
                    </span>
                </div>
                <div className='g1VolResultCard__JobBox'>
                    <div className='g1VolResultCard__Company'>{volunteer.company}</div>
                    <div className='g1VolResultCard__Title'>{volunteer.title}</div>
                </div>
                <ul className='g1VolResultCard__Interests'>
                    {listInterests}
                </ul>
                <ul className='g1VolResultCard__Skills'>
                    {listSkills}
                </ul>
                {   nextEvent
                    ?   <>
                            <hr />
                            <div className='g1VolResultCard__NextEvent'>
                                <span>next event:<br /></span>
                                <Link to={`/event/${nextEvent.eventId}`}>
                                    {nextEvent.topic} HERE
                                </Link>
                            </div>
                        </>
                    : null
                }
                <div className='g1VolResultCard__BackgroundShift'></div>
            </div>
        </div>
    );
}

export default VolunteerCard;
