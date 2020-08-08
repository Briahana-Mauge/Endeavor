import React from 'react';

import FirstAndLastNameInputs from './FirstAndLastNameInputs';
import LoginInputs from './LoginInputs';
import UserTypeSelection from './UserTypeSelection';
import ChangePasswordInputs from './ChangePasswordInputs';
import FellowCohortInput from './FellowCohortInput';
import SignupVolunteerSubForm from './SignupVolunteerSubForm';


export default function SignupForm(props) {
    
    return (
        <>
            <div className="row col-12">

                <div className="g1LandingForm__col col-12 col-sm-6">
                    <FirstAndLastNameInputs
                        firstName={props.firstName}
                        setFirstName={props.setFirstName}
                        lastName={props.lastName}
                        setLastName={props.setLastName}
                    />
                    <LoginInputs
                        email={props.email}
                            setEmail={props.setEmail}
                        password={props.password}
                            setPassword={props.setPassword}
                        formType={props.formType}
                        userType={props.userType}
                    />
                    {
                        props.formType === 'signup' && (props.userType === 'admin' || props.userType === 'fellow')
                        ? <ChangePasswordInputs newPassword={props.newPassword} setNewPassword={props.setNewPassword} />
                        : null
                    }
                </div>

                <div className="g1LandingForm__col col-12 col-sm-6 d-flex flex-column">
                    <UserTypeSelection
                        userType={props.userType}
                        setUserType={props.setUserType}
                    />
                    {
                        props.formType === 'signup' && props.userType === 'fellow'
                            ? <>
                                <FellowCohortInput
                                    setFeedback={props.setFeedback}
                                    cohortId={props.cohortId}
                                    setCohortId={props.setCohortId}
                                    />
                                </>
                            : null
                    }
                </div>

            </div>

            {
                props.formType === 'signup' && props.userType === 'volunteer'
                ? <SignupVolunteerSubForm 
                    setFeedback={props.setFeedback}
                    company={props.company}
                    setCompany={props.setCompany}
                    title={props.title}
                    setTitle={props.setTitle}
                    volunteerSkills={props.volunteerSkills}
                    setVolunteerSkills={props.setVolunteerSkills}
                    mentor={props.mentor}
                    setMentor={props.setMentor}
                    officeHours={props.officeHours}
                    setOfficeHours={props.setOfficeHours}
                    techMockInterview={props.techMockInterview}
                    setTechMockInterview={props.setTechMockInterview}
                    behavioralMockInterview={props.behavioralMockInterview}
                    setBehavioralMockInterview={props.setBehavioralMockInterview}
                    professionalSkillsCoach={props.professionalSkillsCoach}
                    setProfessionalSkillsCoach={props.setProfessionalSkillsCoach}
                    hostSiteVisit={props.hostSiteVisit}
                    setHostSiteVisit={props.setHostSiteVisit}
                    industrySpeaker={props.industrySpeaker}
                    setIndustrySpeaker={props.setIndustrySpeaker}
                    publicProfile={props.publicProfile}
                    setPublicProfile={props.setPublicProfile}
                    />
                : null
            }

            {
                props.userType === ''
                    ? null
                    : <button type='submit' className='btn btn-primary g1-btn--submit'>Sign Up</button>
            }

        </>
    )
}