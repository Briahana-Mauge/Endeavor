import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SignupVolunteerSubForm(props) {
    const { setFeedback } = props;

    const [ skillsList, setSkillsList ] = useState([]);
    const [ skillsTracker, setSkillsTracker ] = useState({});

    useEffect(() => {
        const getSkillsList = () => {
            axios.get(`api/skills`)
            .then(res => setSkillsList(res.data.payload))
            .catch(err => setFeedback(err));
        }

        getSkillsList();
    }, [setFeedback]);

    const manageSkills = (e, skillId) => {
        const list = {...skillsTracker};

        list[skillId] = e.target.checked;
        setSkillsTracker(list);

        const arr = [];
        for (let key in list) {
            if (list[key]) {
                arr.push(parseInt(key));
            }
        }
        props.setVolunteerSkills(arr);
    }

    useEffect(() => {
        const tracker = {};
        for (let skillId of props.volunteerSkills) {
            tracker[skillId] = true;
        }
        setSkillsTracker(tracker);
    }, [props.volunteerSkills]);

    
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
                {skillsList.map(skill => 
                        <div className='form-group form-check' key={skill.skill+skill.skill_id}>
                            <label className='form-check-label mr-4'>
                                <input 
                                    className='form-check-input' 
                                    type='checkbox' 
                                    name='userType'
                                    value={skill.skill_id}
                                    checked={props.volunteerSkills.includes(skill.skill_id)}
                                    onChange={(e) => manageSkills(e, skill.skill_id)}
                                /> {skill.skill}
                            </label>
                        </div>
                    )}
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='mentoring'
                        checked={props.mentor} onChange={e => props.setMentor(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='mentoring'>Interested in mentoring a Pursuit Fellow?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='officeHours'
                        checked={props.officeHours} onChange={e => props.setOfficeHours(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='officeHours'>Interested in being an Office Hours mentor?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='mockTechInterview'
                        checked={props.techMockInterview} onChange={e => props.setTechMockInterview(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='mockTechInterview'>Interested in administering mock technical interviews?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='behavioralInterview'
                        checked={props.behavioralMockInterview} onChange={e => props.setBehavioralMockInterview(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='behavioralInterview'>Interested in behavioral interviewing?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='professionalSkills'
                        checked={props.professionalSkillsCoach} onChange={e => props.setProfessionalSkillsCoach(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='professionalSkills'>Interested in being a professional skills coach?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='siteVisit'
                        checked={props.hostSiteVisit} onChange={e => props.setHostSiteVisit(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='siteVisit'>Interested in hosting a Site Visit at your office?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='industrySpeaker'
                        checked={props.industrySpeaker} onChange={e => props.setIndustrySpeaker(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='industrySpeaker'>Interested in being an Industry Speaker?</label>
                </div>
            </div>

            <div className='col-sm-6'>
                <div className='custom-control custom-switch'>
                    <input 
                        type='checkbox' className='custom-control-input' id='publicProfile'
                        checked={props.publicProfile} onChange={e => props.setPublicProfile(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='publicProfile'>Would you like to have your profile public?</label>
                </div>
            </div>
        </>
    )
}