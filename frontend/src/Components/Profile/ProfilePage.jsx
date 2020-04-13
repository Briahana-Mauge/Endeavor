import React, {useState} from 'react';
import axios from 'axios';

import AdminProfile from './AdminProfile';
import FellowProfile from './FellowProfile';
import VolunteerProfile from './VolunteerProfile';


export default function ProfilePage(props) {
    const {
        loggedUser,
        setUser,
        setFeedback
    } = props;

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
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


    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        try {
            if (password && newPassword && confirmPassword && newPassword === confirmPassword) {
                const requestPath = `/api/users/${loggedUser.a_id || loggedUser.f_id || loggedUser.v_id}`;
                await axios.patch(requestPath, {password, newPassword, confirmPassword});
                
                setFeedback({message: 'Password was successfully updated'});
                setPassword('');
                setNewPassword('');
                setConfirmPassword('')

            } else {
                setFeedback({message: 'All fields are required OR confirmed password does not match new one'});
            }

        } catch (err) {
            setFeedback(err);
        }
    }

    const deleteAccount = async () => {
        const userId = loggedUser.a_id || loggedUser.v_id || loggedUser.f_id

        try {
            await axios.delete(`api/users/${userId}`);

        } catch (err) {
            setFeedback(err);
        }
    }


    return (
        <>
            {
              loggedUser.a_id
                ? <AdminProfile
                    loggedUser={loggedUser}
                    setFeedback={setFeedback}
                    setUser={setUser}

                    email={email}
                        setEmail={setEmail}
                    password={password}
                        setPassword={setPassword}
                    newPassword={newPassword}
                        setNewPassword={setNewPassword}
                    firstName={firstName}
                        setFirstName={setFirstName}
                    lastName={lastName}
                        setLastName={setLastName}
                    confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                    handleUpdatePassword={handleUpdatePassword}
                    deleteAccount={deleteAccount}
                  />
                : null
            }

            {
              loggedUser.f_id
                ? <FellowProfile
                    loggedUser={loggedUser}
                    setFeedback={setFeedback}
                    setUser={setUser}

                    email={email}
                        setEmail={setEmail}
                    password={password}
                        setPassword={setPassword}
                    newPassword={newPassword}
                        setNewPassword={setNewPassword}
                    firstName={firstName}
                        setFirstName={setFirstName}
                    lastName={lastName}
                        setLastName={setLastName}
                    cohortId={cohortId}
                        setCohortId={setCohortId}
                    confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                    handleUpdatePassword={handleUpdatePassword}
                    deleteAccount={deleteAccount}
                  />
                : null
            }

            {
              loggedUser.v_id
                ? <VolunteerProfile
                    loggedUser={loggedUser}
                    setFeedback={setFeedback}
                    setUser={setUser}

                    email={email}
                        setEmail={setEmail}
                    password={password}
                        setPassword={setPassword}
                    newPassword={newPassword}
                        setNewPassword={setNewPassword}
                    firstName={firstName}
                        setFirstName={setFirstName}
                    lastName={lastName}
                        setLastName={setLastName}
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
                    confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                    handleUpdatePassword={handleUpdatePassword}
                    deleteAccount={deleteAccount}
                  />
                : null
            }
        </>
    )
}