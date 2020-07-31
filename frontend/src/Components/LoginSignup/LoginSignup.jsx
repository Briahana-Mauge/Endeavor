import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import CommonSubForm from './CommonSubForm';
import EmailPassword from './EmailPassword';


export default function LoginSignup(props) {
    const {
        formType,
        userType,

        email,
        password, 
        newPassword,
        firstName, 
        lastName,

        cohortId,

        company,
        title,
        volunteerSkills,
        mentor,
        officeHours,
        techMockInterview,
        behavioralMockInterview,
        professionalSkillsCoach,
        hostSiteVisit,
        industrySpeaker,
        publicProfile
    } = props

    const location = useLocation();
    const history = useHistory();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            let { from } = location.state || { from: { pathname: '/' } }; // catches if user wanted to directly go to a specific page
            if (from.pathname === '/login') {
                from = { pathname: '/' }
            }

            if (formType === 'login' && email && password) { // LOGIN
                const { data } = await axios.post(`/api/auth/login`, {email, password});
                props.settleUser(data.payload);
                props.setPassword('');
                history.replace(from);
            }
            else {
                if (userType === 'admin' && email && password && firstName && lastName && newPassword) {
                    const userData = {email, password, firstName, lastName, newPassword};
                    const { data } = await axios.post(`/api/auth/admin/signup`, userData);
                    props.settleUser(data.payload);
                    props.setPassword('');
                    history.replace(from);
                } 
                else if (props.userType === 'fellow' && email && password && firstName && lastName && newPassword && cohortId) {
                    const userData = {email, password, firstName, lastName, newPassword, cohortId};
                    const { data } = await axios.post(`/api/auth/fellow/signup`, userData);
                    props.settleUser(data.payload);
                    history.replace(from);
                } 
                else if (props.userType === 'volunteer' && email && password && firstName && lastName && company && title) {
                    const userData = {
                        email, 
                        password, 
                        firstName, 
                        lastName, 
                        company,
                        title,
                        skills: volunteerSkills,
                        mentor,
                        officeHours,
                        techMockInterview,
                        behavioralMockInterview,
                        professionalSkillsCoach,
                        hostSiteVisit,
                        industrySpeaker,
                        publicProfile
                    };

                    const { data } = await axios.post(`/api/auth/volunteer/signup`, userData);
                    props.settleUser(data.payload);
                    props.setPassword('');
                    history.replace(from);
                }
            }

        } catch (err) {
            props.setFeedback(err);
        }
    }
    
    return (
        <>
            <header className="landing__header">
                <img className='appLogo' src='/images/Endeavor_Logo.png' alt='app logo'/>
            </header>

            <section className="landing__hero">
                <h1 className="tagline">Mobilize. Engage. ACHIEVE.</h1>
                <p>With Endeavor, empower your organization, empower your volunteers.</p>
            </section>

            <form className='form-row' onSubmit={handleFormSubmit}>
                <EmailPassword 
                    email={email}
                        setEmail={props.setEmail}
                    password={password}
                        setPassword={props.setPassword}
                    formType={formType}
                    userType={userType}
                />

                <CommonSubForm 
                    setFeedback={props.setFeedback}
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
                    publicProfile={publicProfile}
                        setPublicProfile={props.setPublicProfile}
                />

            </form>
        </>
    )
}
