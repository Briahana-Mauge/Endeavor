import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import LoginInputs from './LoginInputs';
import SignupForm from './SignupForm';


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
                else if (props.userType === 'volunteer' && email && newPassword && firstName && lastName && company && title) {
                    const userData = {
                        email, 
                        password: newPassword,
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
        <div className="g1Landing">
            <header className="g1Landing__header container">
                <img className='appLogo' src='/images/Endeavor_Logo.png' alt='app logo'/>
            </header>

            <section className="g1Landing__hero container">
                <h1 className={props.formType === 'login' ? "g1Tagline" : "g1Tagline g1Tagline--small"}>Mobilize. Engage. ACHIEVE.</h1>
                <p>With Endeavor, <br className="break-only-small"/> empower your organization by empowering your volunteers.</p>
            </section>

            <form className='g1Landing__g1LandingForm g1LandingForm container pb-4' onSubmit={handleFormSubmit}>
                {props.formType === 'login'

                    ? // LOGIN MODE
                        <>
                            <h2 className="g1LandingForm__header--login">Log In</h2>
                            <div className="g1LandingForm__col">
                                <LoginInputs
                                    email={email}
                                        setEmail={props.setEmail}
                                    password={password}
                                        setPassword={props.setPassword}
                                    formType={formType}
                                    userType={userType}
                                />
                                <button type='submit' className='btn btn-primary g1-btn--submit'>Log In</button>
                            </div>
                            <div className='btn btn-link g1LandingForm__btn-to-signup' onClick={() => props.setFormType('signup')}>New to Endeavor? Sign Up</div>
                        </>

                    : // SIGNUP MODE
                        <>
                            <div className='btn btn-link g1LandingForm__btn-to-login' onClick={() => props.setFormType('login')}>Already a User? Log In</div>
                            <h1 className="g1LandingForm__header--signup">Sign Up</h1>
                            <SignupForm
                                setFeedback={props.setFeedback}
                                email={email}
                                    setEmail={props.setEmail}
                                password={password}
                                    setPassword={props.setPassword}
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
                        </>
                }
            </form>
        </div>
    )
}
