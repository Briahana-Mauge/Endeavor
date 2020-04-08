import React, { useState, useEffect} from 'react';
import axios from 'axios';

export default function SignupAdminSubForm(props) {
    // const [ skillsList, setSkillsList ] = useState([]);
    const [ skillsList, setSkillsList ] = useState([{'skill_id':1, 'skill':'skill1'}, {'skill_id':2, 'skill':'skill2'}, {'skill_id':3, 'skill':'skill3'}]);
    const [ skillsTracker, setSkillsTracker ] = useState({});

    const getSkillsList = async () => {
        try {
            const { data } = await axios.get(`api/skills`);
            setSkillsList(data.payload);
        } catch (err) {
            props.setFeedback(err)
        }
    }

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
        getSkillsList();
    }, []);

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
                            <label className='form-check-label'>
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

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in mentoring a Pursuit Fellow?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.mentor} onChange={e => props.setMentor(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in being an Office Hours mentor?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.officeHours} onChange={e => props.setOfficeHours(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in administering mock technical interviews?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.techMockInterview} onChange={e => props.setTechMockInterview(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in behavioral interviewing?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.behavioralMockInterview} onChange={e => props.setBehavioralMockInterview(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in being a professional skills coach?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.professionalSkillsCoach} onChange={e => props.setProfessionalSkillsCoach(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in hosting a Site Visit at your office?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.hostSiteVisit} onChange={e => props.setHostSiteVisit(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>

            <div className='col-sm-6 row'>
                <span className='col-9'>Interested in being an Industry Speaker?</span>
                <span className='col-3 px-1'>
                    <label className='switch'>
                        <input type='checkbox' checked={props.industrySpeaker} onChange={e => props.setIndustrySpeaker(e.target.checked)}/>
                        <span className='slider round'></span>
                    </label>
                </span>
            </div>
        </>
    )
}