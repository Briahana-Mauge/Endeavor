import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import FirstAndLastNameInputs from '../LoginSignup/FirstAndLastNameInputs';
import EmailPassword from '../LoginSignup/EmailPassword';
import ProfileTabs from './ProfileTabs';
import PasswordUpdate from './PasswordUpdate';
import FileUpload from './FileUpload';
import SignupVolunteerSubForm from '../LoginSignup/SignupVolunteerSubForm';
import Spinner from '../Spinner';

export default function VolunteerProfile(props) {
    const {
        loggedUser,
        setFeedback,
        email,
        password,
        firstName,
        lastName,
        newPassword,
        confirmPassword,
        company,
        title,
        volunteerSkills,
        skills,
        mentor,
        officeHours,
        techMockInterview,
        behavioralMockInterview,
        professionalSkillsCoach,
        hostSiteVisit,
        industrySpeaker,
        publicProfile,
        setFirstName,
        setLastName,
        setEmail,
        setCompany,
        setTitle,
        setVolunteerSkills,
        setMentor,
        setOfficeHours,
        setTechMockInterview,
        setBehavioralMockInterview,
        setProfessionalSkillsCoach,
        setHostSiteVisit,
        setIndustrySpeaker,
        setPublicProfile
    } = props;

    const [ slug, setSlug ] = useState(loggedUser.v_slug);
    const [ bio, setBio ] = useState(loggedUser.v_bio);
    const [ linkedIn, setLinkedIn ] = useState(loggedUser.v_linkedin);
    const [ picFile, setPicFile ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const {pathname} = useLocation();
    const pathName = pathname.split('/');

    
    useEffect(() => {
        let isMounted = true;

        const getVolunteerSkills = () => {
            axios.get(`api/volunteers/skills/${loggedUser.v_id}`)
                .then(response => {
                    if (isMounted) {
                        setVolunteerSkills(response.data.payload.skills_list);
                    }
                })
                .catch (err => {
                    if (isMounted) {
                        setFeedback(err)
                    }
                })
        }
        getVolunteerSkills();

        setFirstName(loggedUser.v_first_name);
        setLastName(loggedUser.v_last_name);
        setEmail(loggedUser.v_email);
        setSlug(loggedUser.v_slug);
        setBio(loggedUser.v_bio);
        setLinkedIn(loggedUser.v_linkedin);
        setCompany(loggedUser.company);
        setTitle(loggedUser.title);
        setMentor(loggedUser.mentoring);
        setOfficeHours(loggedUser.office_hours);
        setTechMockInterview(loggedUser.tech_mock_interview);
        setBehavioralMockInterview(loggedUser.behavioral_mock_interview);
        setProfessionalSkillsCoach(loggedUser.professional_skills_coach);
        setHostSiteVisit(loggedUser.hosting_site_visit);
        setIndustrySpeaker(loggedUser.industry_speaker);
        setPublicProfile(loggedUser.public_profile);

        //Cleanup
        return () => isMounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedUser]);


    const handleUpdateInfo = async (e) => {
        e.preventDefault();

        try {
            if (email && password && firstName && lastName && company && title) {
                let profile = null;
                
                if (picFile) {
                    profile = new FormData();
                    profile.append('email', email);
                    profile.append('password', password);
                    profile.append('firstName', firstName);
                    profile.append('lastName', lastName);
                    profile.append('slug', slug);
                    profile.append('company', company);
                    profile.append('title', title);
                    profile.append('skills', volunteerSkills);
                    profile.append('bio', bio);
                    profile.append('linkedIn', linkedIn);
                    profile.append('mentor', mentor);
                    profile.append('officeHours', officeHours);
                    profile.append('techMockInterview', techMockInterview);
                    profile.append('behavioralMockInterview', behavioralMockInterview);
                    profile.append('professionalSkillsCoach', professionalSkillsCoach);
                    profile.append('hostSiteVisit', hostSiteVisit);
                    profile.append('industrySpeaker', industrySpeaker);
                    profile.append('publicProfile', publicProfile);
                    profile.append('picture', picFile);
                } else {
                    profile = {
                        email,
                        password,
                        firstName,
                        lastName,
                        slug,
                        company,
                        title,
                        skills: volunteerSkills,
                        bio,
                        linkedIn,
                        mentor,
                        officeHours,
                        techMockInterview,
                        behavioralMockInterview,
                        professionalSkillsCoach,
                        hostSiteVisit,
                        industrySpeaker,
                        publicProfile
                    };
                }

                setLoading(true);
                const { data } = await axios.put(`/api/auth/${loggedUser.v_id}`, profile);
                props.settleUser(data.payload);
                setLoading(false);
                props.setPassword('');
                setFeedback({message: 'Profile updated successfully'});
            } else {
                setFeedback({message: 'email, password, first and last name, company, and title fields are required'});
            }

        } catch (err) {
            setLoading(false);
            setFeedback(err);
        }
    }

    if (loading) {
        return <Spinner/>
    }
    
    return (
        <>
            {
                pathName[2] && pathName[2].toLowerCase() === 'password' 
                ?   <>
                        <ProfileTabs profileTab='' passwordTab='active'/>
                        <form className='form-row mt-3' onSubmit={props.handleUpdatePassword}>
                            <PasswordUpdate 
                                password={password}
                                setPassword={props.setPassword}
                                newPassword={newPassword}
                                setNewPassword={props.setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={props.setConfirmPassword}
                            />

                            <button type='submit' className='btn btn-primary'>Update</button>
                        </form>
                    </>

                :   <>
                        <ProfileTabs profileTab='active' passwordTab=''/>
                        <form className='form-row mt-3' onSubmit={handleUpdateInfo}>
                                <div className='form-group col-sm-12'>
                                    <label className='col-sm-8' htmlFor='slugText' >
                                        If you chose to have your profile public, this is the slug to your profile
                                    </label>
                                    <input 
                                        className='form-control col-sm-4' 
                                        style={{display: 'inline-block'}}
                                        id='slugText'
                                        type='text' 
                                        placeholder='Slug' 
                                        value={slug}
                                        onChange={e => setSlug(e.target.value)}
                                    />
                                </div>

                            <FirstAndLastNameInputs 
                                firstName={firstName}
                                setFirstName={setFirstName}
                                lastName={lastName}
                                setLastName={setLastName}
                            />

                            <EmailPassword 
                                email={email}
                                setEmail={setEmail}
                                password={password}
                                setPassword={props.setPassword}
                            />

                            <SignupVolunteerSubForm 
                                setFeedback={setFeedback} 
                                company={company}
                                setCompany={setCompany}
                                title={title}
                                setTitle={setTitle}
                                volunteerSkills={volunteerSkills}
                                setVolunteerSkills={props.setVolunteerSkills}
                                skills={skills}
                                mentor={mentor}
                                setMentor={setMentor}
                                officeHours={officeHours}
                                setOfficeHours={setOfficeHours}
                                techMockInterview={techMockInterview}
                                setTechMockInterview={setTechMockInterview}
                                behavioralMockInterview={behavioralMockInterview}
                                setBehavioralMockInterview={setBehavioralMockInterview}
                                professionalSkillsCoach={professionalSkillsCoach}
                                setProfessionalSkillsCoach={setProfessionalSkillsCoach}
                                hostSiteVisit={hostSiteVisit}
                                setHostSiteVisit={setHostSiteVisit}
                                industrySpeaker={industrySpeaker}
                                setIndustrySpeaker={setIndustrySpeaker}
                                publicProfile={publicProfile}
                                setPublicProfile={setPublicProfile}
                            />

                            <div className='col-sm-12'>
                                <textarea 
                                    className='form-control mb-2' 
                                    placeholder='Enter bio' 
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                />
                            </div>

                            <div className='col-sm-6'>
                                <input 
                                    className='form-control mb-2' 
                                    type='text' 
                                    placeholder='LinkedIn link ' 
                                    value={linkedIn}
                                    onChange={e => setLinkedIn(e.target.value)}
                                />
                            </div>

                            <FileUpload imageLink={loggedUser.v_picture} setPicFile={setPicFile}/>

                            <div className='col-sm-6'>
                                <button type='submit' className='btn btn-primary mr-5'>Update</button>
                            </div>
                        </form>

                        <br />
                        <button className='btn btn-danger mb-4 float-right' onClick={props.deleteAccount}>Delete Account</button>
                    </>
            }

        </>
    )
}