import React, { useState, useEffect} from 'react';
import axios from 'axios';

export default function SignupAdminSubForm(props) {
    // const [ skills, setSkills ] = useState([]);
    const [ skills, setSkills ] = useState([{'skill_id':1, 'skill':'skill1'}, {'skill_id':2, 'skill':'skill2'}, {'skill_id':3, 'skill':'skill3'}]);

    const getSkillsList = async () => {
        try {
            const { data } = await axios.get(`api/skills`);
            setSkills(data.payload);
        } catch (err) {
            props.setNetworkError(err)
        }
    }

    const skillsTracker = (e, skillId) => {
        const list = {...props.volunteerSkills};
        list[skillId] = e.target.checked;
        console.log(list);
        props.setVolunteerSkills(list)
    }

    useEffect(() => {
        getSkillsList();
    }, [])

    return (
        <>
            <div className='col-sm-6'>
                <input 
                    type='text' 
                    className='form-control mb-2' 
                    placeholder='Enter company/employer'
                    value={props.company}
                    onChange={e => props.setCompany(e.target.value)}
                    />
            </div>

            <div className='col-sm-6'>
                <input 
                    type='text' 
                    className='form-control mb-2' 
                    placeholder='Enter title'
                    value={props.title}
                    onChange={e => props.setTitle(e.target.value)}
                    />
            </div>

            <span>Please select all the skills you're interested in helping our fellows with</span> <br />
            <div className='col-12 d-flex flex-wrap justify-content-between'>
                {skills.map(skill => 
                        <div className='form-group form-check' key={skill.skill+skill.skill_id}>
                            <label className='form-check-label'>
                                <input 
                                    className='form-check-input' 
                                    type='checkbox' 
                                    name='userType'
                                    value={skill.skill_id}
                                    onChange={(e) => skillsTracker(e, skill.skill_id)}
                                /> {skill.skill}
                            </label>
                        </div>
                    )}
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in mentoring a Pursuit Fellow?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.mentor} onChange={e => props.setMentor(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in being an Office Hours mentor?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.OfficeHours} onChange={e => props.setOfficeHours(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in administering mock technical interviews?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.techMockInterview} onChange={e => props.setTechMockInterview(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in behavioral interviewing?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.behavioralMockInterview} onChange={e => props.setBehavioralMockInterview(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in being a professional skills coach?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.professionalSkillsCoach} onChange={e => props.setProfessionalSkillsCoach(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in hosting a Site Visit at your office?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.hostSiteVisit} onChange={e => props.setHostSiteVisit(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in being an Industry Speaker?</span>
                <label className='switch col-2 mr-3'>
                    <input type='checkbox' checked={props.industrySpeaker} onChange={e => props.setIndustrySpeaker(e.target.checked)}/>
                    <span className='slider round'></span>
                </label>
            </div>
        </>
    )
}