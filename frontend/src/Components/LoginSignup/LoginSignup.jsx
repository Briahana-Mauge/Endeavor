import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import CommonSubForm from './CommonSubForm';
import EmailPassword from './EmailPassword';


export default function LoginSignup(props) {
    const {
        loggedUser,
        setUser,
        setFeedback
    } = props;

    const [ formType, setFormType ] = useState('login');
    const [ userType, setUserType ] = useState('');

    const [ email, setEmail ] = useState('alexis@pursuit.org');
    const [ password, setPassword ] = useState('1234');
    const [ newPassword, setNewPassword ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ cohortId, setCohortId ] = useState(0);
    const [ company, setCompany ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ volunteerSkills, setVolunteerSkills ] = useState([]);
    const [ mentor, setMentor ] = useState(false);
    const [ officeHours, setOfficeHours ] = useState(false);
    const [ techMockInterview, setTechMockInterview ] = useState(false);
    const [ behavioralMockInterview, setBehavioralMockInterview ] = useState(false);
    const [ professionalSkillsCoach, setProfessionalSkillsCoach ] = useState(false);
    const [ hostSiteVisit, setHostSiteVisit ] = useState(false);
    const [ industrySpeaker, setIndustrySpeaker ] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (loggedUser.a_id || loggedUser.v_id || loggedUser.f_id) {
            history.push('/home');
        }
    }, [loggedUser, history]);


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formType === 'login' && email && password) { // LOGIN
                const { data } = await axios.post(`/api/auth/login`, {email, password});
                setUser(data.payload);
            }
            else {
                if (userType === 'admin' && email && password && firstName && lastName && newPassword) {
                    const userData = {email, password, firstName, lastName, newPassword};
                    const { data } = await axios.post(`/api/auth/admin/signup`, userData);
                    setUser(data.payload);
                } else if (userType === 'fellow' && email && password && firstName && lastName && newPassword && cohortId) {
                    const userData = {email, password, firstName, lastName, newPassword, cohortId};
                    const { data } = await axios.post(`/api/auth/fellow/signup`, userData);
                    setUser(data.payload);
                } else if (userType === 'volunteer' && email && password && firstName && lastName && company && title) {
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
                    setUser(data.payload);
                }
            }

        } catch (err) {
            setFeedback(err);
        }
    }


    return (
        <div>
            <img className='d-block mx-auto appLogo' src='/images/app_logo.jpg' alt='app logo'/>
            
            <form className='form-row' onSubmit={handleFormSubmit}>
                <EmailPassword 
                    email={email}
                        setEmail={setEmail}
                    password={password}
                        setPassword={setPassword}
                    formType={formType}
                    userType={userType}
                />

                <CommonSubForm 
                    formType={formType} 
                        setFormType={setFormType}
                    userType={userType}
                        setUserType={setUserType}

                    setFeedback={setFeedback}

                    firstName={firstName}
                        setFirstName={setFirstName}
                    lastName={lastName}
                        setLastName={setLastName}
                    newPassword={newPassword}
                        setNewPassword={setNewPassword}
                    cohortId={cohortId}
                        setCohortId={setCohortId}
                    company={company}
                        setCompany={setCompany}
                    title={title}
                        setTitle={setTitle}
                    volunteerSkills={volunteerSkills}
                        setVolunteerSkills={setVolunteerSkills}
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
                />
            </form>
        </div>
    );
}