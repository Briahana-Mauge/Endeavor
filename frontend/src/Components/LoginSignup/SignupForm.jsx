import React, { useState } from 'react';

import FirstAndLastNameInputs from './FirstAndLastNameInputs';
import LoginInputs from './LoginInputs';
import UserTypeSelection from './UserTypeSelection';
import GetNewPasswordInputs from './GetNewPasswordInputs';
import FellowCohortInput from './FellowCohortInput';
import VolunteerSubForm from './VolunteerSubForm';


export default function SignupForm(props) {
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const isSignupDisabled = (
        props.userType === '' ||
        confirmPassword === '' ||
        confirmPassword !== props.newPassword
    );


    return (
        <>
            <div className="row col-12 g1NoGutters g1SignupForm">

                <div className="g1InputCol col-12 col-sm-6 d-flex flex-column">
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
                    <GetNewPasswordInputs
                        newPassword={props.newPassword}
                        setNewPassword={props.setNewPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                    />
                </div>

                <div className="g1InputCol col-12 col-sm-6 d-flex flex-column">
                    <UserTypeSelection
                        userType={props.userType}
                        setUserType={props.setUserType}
                    />
                    {   // Fellow Cohort Select
                        props.formType === 'signup' && props.userType === 'fellow'
                            ?   <>
                                    <FellowCohortInput
                                        setFeedback={props.setFeedback}
                                        cohortId={props.cohortId}
                                        setCohortId={props.setCohortId}
                                    />
                                </>
                            : null
                    }
                    {   // Volunteer Company and Title Inputs
                        props.formType === 'signup' && props.userType === 'volunteer'
                            ?   <>
                                    <label htmlFor="companyTxt" className="g1TxtLabel mt-auto">Company / Employer
                                        <input
                                            type='text'
                                            id='companyTxt'
                                            className='form-control'
                                            placeholder=''
                                            value={props.company}
                                            onChange={e => props.setCompany(e.target.value)}
                                        />
                                    </label>
                                    <label htmlFor="titleTxt" className="g1TxtLabel">Position
                                        <input
                                            type='text'
                                            id='titleTxt'
                                            className='form-control'
                                            placeholder=''
                                            value={props.title}
                                            onChange={e => props.setTitle(e.target.value)}
                                        />
                                    </label>
                                </>
                            :   null
                    }
                </div>
            </div>

            {   // Volunteer-Specific Form
                props.formType === 'signup' && props.userType === 'volunteer'
                    ?   <VolunteerSubForm
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
                    :   null
            }

            <div className="g1InputCol">
                {   // Submit Button, disabled if any unwanted conditions (see isSignupDisabled above) are true
                    isSignupDisabled
                        ?   <button
                                type='submit'
                                className='btn btn-primary g1-btn--submit disabled'
                                disabled
                            >
                                Sign Up
                            </button>
                        :   <button
                                type='submit'
                                className='btn btn-primary g1-btn--submit'
                            >
                                Sign Up
                            </button>
                }
            </div>

        </>
    )
}
