import React from 'react';

import SignupAdminSubForm from './SignupAdminSubForm';
import SignupFellowSubForm from './SignupFellowSubForm';
import SignupVolunteerSubForm from './SignupVolunteerSubForm';
import UserTypeSelection from './UserTypeSelection';
import FirstAndLastNameInputs from './FirstAndLastNameInputs';


export default function CommonSubForm(props) {
    // userType={userType}
    // setUserType={setUserType}
    return (
        <>
            {
                props.formType === 'login'
                ? 
                    <span className='col-12 d-flex flex-wrap justify-content-between'>
                        <button type='submit' className='btn btn-primary'>Sign In</button>
                        <span className='mb-2 mx-2 mr-sm-2'>New to this app?
                            <span className='btn btn-link' onClick={() => props.setFormType('signup')}>Sign up</span>
                        </span>
                    </span>
                    
                :
                    <>

                        <UserTypeSelection 
                            userType={props.userType}
                            setUserType={props.setUserType}
                        />

                        <FirstAndLastNameInputs 
                            firstName={props.firstName}
                            setFirstName={props.setFirstName}
                            lastName={props.lastName}
                            setLastName={props.setLastName}
                        />


                        {
                            props.formType === 'signup' && (props.userType === 'admin' || props.userType === 'fellow')
                            ? <SignupAdminSubForm newPassword={props.newPassword} setNewPassword={props.setNewPassword}/>
                            : null
                            
                        }

                        {
                            props.formType === 'signup' && props.userType === 'fellow'
                            ? <>
                                <SignupFellowSubForm 
                                    setFeedback={props.setFeedback}
                                    cohortId={props.cohortId}
                                    setCohortId={props.setCohortId}
                                    />
                                </>
                            : null
                        }
                        
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
                                skills={props.skills}
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
                                />
                            : null
                        }


                        <span className='col-12 d-flex flex-wrap justify-content-between'>
                            <button type='submit' className='btn btn-primary'>Sign Up</button>
                            <span className='mb-2 mx-2 mr-sm-2'>Already a user?
                                <span className='btn btn-link' onClick={() => props.setFormType('login')}>Sign In</span>
                            </span>
                        </span>
                    </>
            }
        </>
    )
}