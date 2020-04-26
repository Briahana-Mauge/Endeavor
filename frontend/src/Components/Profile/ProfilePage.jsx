import React, {useState} from 'react';
import axios from 'axios';

import AdminProfile from './AdminProfile';
import FellowProfile from './FellowProfile';
import VolunteerProfile from './VolunteerProfile';


export default function ProfilePage(props) {
    const {
        loggedUser,
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
        industrySpeaker,
    } = props;

    const [ confirmPassword, setConfirmPassword ] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        try {
            if (password && newPassword && confirmPassword && newPassword === confirmPassword) {
                const requestPath = `/api/users/${loggedUser.a_id || loggedUser.f_id || loggedUser.v_id}`;
                await axios.patch(requestPath, {password, newPassword, confirmPassword});
                
                props.setFeedback({message: 'Password was successfully updated'});
                props.setPassword('');
                props.setNewPassword('');
                setConfirmPassword('');

            } else {
                props.setFeedback({message: 'All fields are required OR confirmed password does not match new one'});
            }

        } catch (err) {
            props.setFeedback(err);
        }
    }

    const deleteAccount = async () => {
        const userId = loggedUser.a_id || loggedUser.v_id || loggedUser.f_id

        try {
            await axios.delete(`api/users/${userId}`);

        } catch (err) {
            props.setFeedback(err);
        }
    }

    return (
        <>
            {
                loggedUser.a_id
                ? <AdminProfile
                    loggedUser={loggedUser}
                    setFeedback={props.setFeedback} 
                    settleUser={props.settleUser}
                    email={email}
                    setEmail={props.setEmail}
                    password={password}
                    setPassword={props.setPassword}
                    firstName={firstName}
                    setFirstName={props.setFirstName}
                    lastName={lastName}
                    setLastName={props.setLastName}
                    newPassword={newPassword}
                    setNewPassword={props.setNewPassword}
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
                    setFeedback={props.setFeedback} 
                    settleUser={props.settleUser}
                    email={email}
                    setEmail={props.setEmail}
                    password={password}
                    setPassword={props.setPassword}
                    firstName={firstName}
                    setFirstName={props.setFirstName}
                    lastName={lastName}
                    setLastName={props.setLastName}
                    newPassword={newPassword}
                    setNewPassword={props.setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    cohortId={cohortId}
                    setCohortId={props.setCohortId}
                    handleUpdatePassword={handleUpdatePassword}
                    deleteAccount={deleteAccount}
                  />
                : null
            }

            {
                loggedUser.v_id
                ? <VolunteerProfile
                    loggedUser={loggedUser}
                    setFeedback={props.setFeedback} 
                    settleUser={props.settleUser}
                    email={email}
                    setEmail={props.setEmail}
                    password={password}
                    setPassword={props.setPassword}
                    firstName={firstName}
                    setFirstName={props.setFirstName}
                    lastName={lastName}
                    setLastName={props.setLastName}
                    newPassword={newPassword}
                    setNewPassword={props.setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    company={company}
                    setCompany={props.setCompany}
                    title={title}
                    setTitle={props.setTitle}
                    volunteerSkills={volunteerSkills}
                    setVolunteerSkills={props.setVolunteerSkills}
                    skills={skills}
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
                    publicProfile={props.publicProfile}
                    setPublicProfile={props.setPublicProfile}
                    handleUpdatePassword={handleUpdatePassword}
                    deleteAccount={deleteAccount}
                  />
                : null
            }
        </>
    )
}