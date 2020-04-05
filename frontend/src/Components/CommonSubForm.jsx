import React from 'react';

import SignupAdminSubForm from './SignupAdminSubForm';
import SignupFellowSubForm from './SignupFellowSubForm';
import SignupVolunteerSubForm from './SignupVolunteerSubForm';


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

                        <div className='col-12 d-flex flex-wrap justify-content-between'>
                            <div className='form-group form-check'>
                                <label className='form-check-label'>
                                    <input 
                                        className='form-check-input' 
                                        type='radio' 
                                        name='userType'
                                        value={props.userType}
                                        onChange={() => props.setUserType('admin')}
                                    /> Admin
                                </label>
                            </div>
                            <div className='form-group form-check'>
                                <label className='form-check-label'>
                                    <input 
                                        className='form-check-input' 
                                        type='radio' 
                                        name='userType'
                                        value={props.userType}
                                        onChange={() => props.setUserType('volunteer')}
                                    /> Volunteer
                                </label>
                            </div>
                            <div className='form-group form-check'>
                                <label className='form-check-label'>
                                    <input 
                                        className='form-check-input' 
                                        type='radio' 
                                        name='userType'
                                        value={props.userType}
                                        onChange={() => props.setUserType('fellow')}
                                    /> Fellow
                                </label>
                            </div>
                        </div>

                        <div className='col-sm-6'>
                            <input 
                                type='text' 
                                className='form-control mb-2' 
                                placeholder='Enter first name' 
                                value={props.firstName}
                                onChange={e => props.setFirstName(e.target.value)}
                            />
                        </div>

                        <div className='col-sm-6'>
                            <input 
                                type='text' 
                                className='form-control mb-2' 
                                placeholder='Enter last name'
                                value={props.lastName}
                                onChange={e => props.setLastName(e.target.value)}
                            />
                        </div>


                        {
                            props.formType === 'signup' && props.userType === 'admin'
                            ? <SignupAdminSubForm newPassword={props.newPassword} setNewPassword={props.setNewPassword}/>
                            : null
                            
                        }

                        {
                            props.formType === 'signup' && props.userType === 'fellow'
                            ? <SignupFellowSubForm 
                                setNetworkError={props.setNetworkError} 
                                cohortId={props.cohortId}
                                setCohortId={props.setCohortId}
                                />
                            : null
                        }

{
                            props.formType === 'signup' && props.userType === 'volunteer'
                            ? <SignupVolunteerSubForm 
                                setNetworkError={props.setNetworkError} 
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