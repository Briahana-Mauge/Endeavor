import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import CommonSubForm from './CommonSubForm';
import EmailPassword from './EmailPassword';


export default function LoginSignup(props) {
    const {
        loggedUser,

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
        industrySpeaker
    } = props

    const location = useLocation();
    // unsure if this chunk of code to Redirect away from login screen if already logged in is now redundant because of LoginSignupGate
    const history = useHistory();

    useEffect(() => {
        if (loggedUser.a_id || loggedUser.v_id || loggedUser.f_id) {
            history.push('/home');
        }
    }, [loggedUser, history]);
    //

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formType === 'login' && email && password) { // LOGIN
                const { from } = location.state || { from: { pathname: "/" } }; // catches if user wanted to directly go to a specific page
                const { data } = await axios.post(`/api/auth/login`, {email, password});
                props.settleUser(data.payload);
                history.replace(from);
            }
            else {
                if (userType === 'admin' && email && password && firstName && lastName && newPassword) {
                    const userData = {email, password, firstName, lastName, newPassword};
                    const { data } = await axios.post(`/api/auth/admin/signup`, userData);
                    props.settleUser(data.payload);
                } else if (props.userType === 'fellow' && email && password && firstName && lastName && newPassword && cohortId) {
                    const userData = {email, password, firstName, lastName, newPassword, cohortId};
                    const { data } = await axios.post(`/api/auth/fellow/signup`, userData);
                    props.settleUser(data.payload);
                } else if (props.userType === 'volunteer' && email && password && firstName && lastName && company && title) {
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
                        industrySpeaker
                    };

                    const { data } = await axios.post(`/api/auth/volunteer/signup`, userData);
                    props.settleUser(data.payload);
                }
            }

        } catch (err) {
            props.setFeedback(err);
        }
    }
    
    return (
        <div> 
            <img className='d-block mx-auto appLogo' src='/images/app_logo.jpg' alt='app logo'/>
            
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
                />

            </form>
        </div>
    )
}