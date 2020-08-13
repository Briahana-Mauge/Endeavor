import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VolunteerSubForm(props) {
    const { setFeedback } = props;

    const [ skillsList, setSkillsList ] = useState([]);
    const [ skillsTracker, setSkillsTracker ] = useState({});

    useEffect(() => {
        let isMounted = true;

        const getSkillsList = () => {
            axios.get(`api/skills`)
            .then(response => {
                if (isMounted) {
                    setSkillsList(response.data.payload);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setFeedback(err);
                }
            });
        }
        getSkillsList();

        //Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const label = [
        'language',
        'framework',
        'otherSkill'
    ];
    const skillsSectionMap = {
        'CSS': label[0],
        'HTML': label[0],
        'Java': label[0],
        'Javascript': label[0],
        'Objective-C': label[0],
        'Python': label[0],
        'R': label[0],
        'Scala': label[0],
        'Swift': label[0],
    
        'Angular': label[1],
        'Django': label[1],
        'Flask': label[1],
        'React': label[1],
        'React Native': label[1],
        'Ruby on Rails': label[1],
    
        'Company Research': label[2],
        'Negotiations': label[2],
        'Personal Finance': label[2],
        'Personal Narrative, and Pop Pitches': label[2],
        'Product Design, UX, and Prototyping': label[2],
        'Professional Communication': label[2],
        'Project Management: Roles, Tools, and Best Practices': label[2],
        'Resumes, LinkedIn, and Cover Letters': label[2],
        'Talking About Tech Projects in Interviews': label[2],
        'Written Communication': label[2]
    };
    const listLanguages = [];
    const listFrameworks = [];
    const listOtherSkills = [];
    skillsList.forEach(skill => {
        const skillItem = (
            <div className='form-check mb-2' key={skill.skill+skill.skill_id}>
                <label className='form-check-label mr-4'>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        name='skill'
                        value={skill.skill_id}
                        checked={props.volunteerSkills.includes(skill.skill_id)}
                        onChange={(e) => manageSkills(e, skill.skill_id)}
                    />
                        {skill.skill}
                </label>
            </div>
        );
        switch (skillsSectionMap[skill.skill]) {
            case 'language':
                listLanguages.push(skillItem); break;
            case 'framework':
                listFrameworks.push(skillItem); break;
            case 'otherSkill':
                listOtherSkills.push(skillItem); break;
            default:
                listOtherSkills.push(skillItem); break;
        }
    })


    return (
        <div className="g1VolunteerSubForm row col-12 mt-4 g1NoGutters mx-auto">

            <div className="col-12"> {/* nested Bootstrap col for consistent padding */}
                <hr className="mb-4" />
                Please select the skills below you're interested in and capable of helping our fellows with:
            </div>

            <div className="col-12 col-sm-6 col-lg-3 d-flex flex-column">
                <div className="g1SkillsHeader">Languages</div>
                {listLanguages}
            </div>
            <div className="col-12 col-sm-6 col-lg-3 d-flex flex-column">
                <div className="g1SkillsHeader">Frameworks</div>
                {listFrameworks}
            </div>
            <div className="col-12 col-lg-6 mt-sm-2 mt-lg-0 d-flex flex-column">
                <div className="g1SkillsHeader">Other Skills</div>
                {listOtherSkills}
            </div>

            <div className="col-12 mb-3 mt-3"> {/* nested Bootstrap col for consistent padding */}
                <hr className="mb-4" />
                Which of the following are you interested in assisting with?
            </div>

            <div className='col-12'>
                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='mentoring'
                        checked={props.mentor} onChange={e => props.setMentor(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='mentoring'>Mentoring a Pursuit Fellow?</label>
                </div>

                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='officeHours'
                        checked={props.officeHours} onChange={e => props.setOfficeHours(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='officeHours'>Being an Office Hours mentor?</label>
                </div>

                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='mockTechInterview'
                        checked={props.techMockInterview} onChange={e => props.setTechMockInterview(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='mockTechInterview'>Administering mock technical interviews?</label>
                </div>

                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='behavioralInterview'
                        checked={props.behavioralMockInterview} onChange={e => props.setBehavioralMockInterview(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='behavioralInterview'>Behavioral interviewing?</label>
                </div>

                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='professionalSkills'
                        checked={props.professionalSkillsCoach} onChange={e => props.setProfessionalSkillsCoach(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='professionalSkills'>Being a professional skills coach?</label>
                </div>

                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='siteVisit'
                        checked={props.hostSiteVisit} onChange={e => props.setHostSiteVisit(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='siteVisit'>Hosting a Site Visit at your office?</label>
                </div>

                <div className='custom-control custom-switch mb-2'>
                    <input 
                        type='checkbox' className='custom-control-input' id='industrySpeaker'
                        checked={props.industrySpeaker} onChange={e => props.setIndustrySpeaker(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='industrySpeaker'>Being an Industry Speaker?</label>
                </div>

            </div>
            <div className="col-12 mb-3 mt-3"> {/* nested Bootstrap col for consistent padding */}
                <hr className="mb-4" />
                <div className='custom-control custom-switch mb-2'>
                    <input
                        type='checkbox' className='custom-control-input' id='publicProfile'
                        checked={props.publicProfile} onChange={e => props.setPublicProfile(e.target.checked)}
                    />
                    <label className='custom-control-label' htmlFor='publicProfile'>
                        Would you like to have your profile publicly visible? (You can change this later at any time.)
                    </label>
                </div>
            </div>

        </div>
    )
}
