import React from 'react';
import axios from 'axios';

import CommonSubForm from './CommonSubForm';


export default function LoginSignup(props) {
    const {
        formType,
        userType,
        email, 
        password, 
        firstName, 
        lastName,
        newPassword,
        cohortId, 
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
        industrySpeaker
    } = props
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formType === 'login' && email && password) { // LOGIN
                const { data } = await axios.post(`/api/auth/login`, {email, password});
                props.setUser(data.payload);
            }
            else {
                if (userType === 'admin' && email && password && firstName && lastName && newPassword) {
                    const userData = {email, password, firstName, lastName, newPassword};
                    const { data } = await axios.post(`/api/auth/admin/signup`, userData);
                    props.setUser(data.payload);
                } else if (props.userType === 'fellow' && email && password && firstName && lastName && newPassword && cohortId) {
                    const userData = {email, password, firstName, lastName, newPassword, cohortId};
                    const { data } = await axios.post(`/api/auth/fellow/signup`, userData);
                    props.setUser(data.payload);
                } else if (props.userType === 'volunteer' && email && password && firstName && lastName && company && title) {
                    const userData = {
                        email, 
                        password, 
                        firstName, 
                        lastName, 
                        company,
                        title,
                        skills,
                        mentor,
                        officeHours,
                        techMockInterview,
                        behavioralMockInterview,
                        professionalSkillsCoach,
                        hostSiteVisit,
                        industrySpeaker
                    };

                    const { data } = await axios.post(`/api/auth/volunteer/signup`, userData);
                    props.setUser(data.payload);
                }
            }

        } catch (err) {
            props.setNetworkError(err)
        }
    }
    
    return (
        <div> 
            <img className='d-block mx-auto appLogo' src='/images/app_logo.jpg' alt='app logo'/>
            
            <form className='form-row' onSubmit={handleFormSubmit}>
                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='email' 
                        placeholder='Enter email' 
                        value={email}
                        onChange={e => props.setEmail(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <input 
                        type='password' 
                        className='form-control mb-2' 
                        placeholder={
                            formType === 'signup' && (userType === 'admin' || userType === 'fellow') 
                            ? 'Enter default password proved by your Admin' 
                            : 'Enter password'
                        } 
                        value={password}
                        onChange={e => props.setPassword(e.target.value)}
                    />
                </div>

                <CommonSubForm 
                    formType={formType} 
                    setFormType={props.setFormType} 
                    userType={userType}
                    setUserType={props.setUserType}
                    firstName={firstName}
                    setFirstName={props.setFirstName}
                    lastName={lastName}
                    setLastName={props.setLastName}
                    newPassword={newPassword}
                    setNewPassword={props.setNewPassword}
                    setNetworkError={props.setNetworkError}
                    cohortId={cohortId}
                    setCohortId={props.setCohortId}
                    company={company}
                    setCompany={props.setCompany}
                    title={title}
                    setTitle={props.setTitle}
                    volunteerSkills={volunteerSkills}
                    setVolunteerSkills={props.setVolunteerSkills}
                    mentor={mentor}
                    setMentor={props.setMentor}
                    officeHours={officeHours}
                    setOfficeHours={props.setOfficeHours}
                    techMockInterview={techMockInterview}
                    setTechMockInterview={props.setTechMockInterview}
                    behavioralMockInterview={behavioralMockInterview}
                    setBehavioralMockInterview={props.setBehavioralMockInterview}
                    professionalSkillsCoach={professionalSkillsCoach}
                    setProfessionalSkillsCoach={props.setProfessionalSkillsCoach}
                    hostSiteVisit={hostSiteVisit}
                    setHostSiteVisit={props.setHostSiteVisit}
                    industrySpeaker={industrySpeaker}
                    setIndustrySpeaker={props.setIndustrySpeaker}
                />

            </form>
        </div>
    )
}