import React, { useState } from 'react';
import axios from 'axios';

import CommonSubForm from './CommonSubForm';


export default function LoginSignup(props) {
    const [ formType, setFormType ] = useState('login');
    const [ userType, setUserType ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ cohortId, setCohortId ] = useState(0);
    const [ company, setCompany ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ volunteerSkills, setVolunteerSkills ] = useState({});
    const [ mentor, setMentor ] = useState(true);
console.log(volunteerSkills)

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formType === 'login' && email && password) { // LOGIN
                const { data } = await axios.post(`/api/auth/login`, {email, password});
                props.setUser(data.payload);
            }
            else {
                if (userType === 'admin' && email && password && firstName && lastName && newPassword) {
                    const userData = {email, password, firstName, lastName, newPassword};
                    const { data } = await axios.post(`/api/auth/admin/signup`, userData);
                    props.setUser(data.payload);
                }

            }

        } catch (err) {
            props.setNetworkError(err)
        }
    }
    return (
        <div> 
            <img className='d-block mx-auto appLogo' src='/images/app_logo.jpg' alt='app logo'/>
            
            <form className='form-row' onSubmit={handleFormSubmit}>
                <div className='col-sm-6'>
                    <input 
                        className='form-control mb-2' 
                        type='email' 
                        placeholder='Enter email' 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className='col-sm-6'>
                    <input 
                        type='password' 
                        className='form-control mb-2' 
                        placeholder={formType === 'signup' && userType === 'admin' ? 'Enter default password proved by your Admin' : 'Enter password'} 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <CommonSubForm 
                    formType={formType} 
                    setFormType={setFormType} 
                    userType={userType}
                    setUserType={setUserType}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    setNetworkError={props.setNetworkError}
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
                />

            </form>
        </div>
    )
}