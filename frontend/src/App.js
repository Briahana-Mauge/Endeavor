import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import './App.scss';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Feedback from './Components/Feedback';
import VolunteerSearch from './Components/VolunteerSearch';
import ProfilePage from './Components/Profile/ProfilePage';
import AdminTools from './Components/AdminTools/AdminTools';


function App() {
  const history = useHistory();

  const [ loggedUser, setLoggedUser ] = useState({});
  const [ feedback, setFeedback ] = useState(null);

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
  const [ volunteerSkills, setVolunteerSkills ] = useState([]);
  const [ mentor, setMentor ] = useState(false);
  const [ officeHours, setOfficeHours ] = useState(false);
  const [ techMockInterview, setTechMockInterview ] = useState(false);
  const [ behavioralMockInterview, setBehavioralMockInterview ] = useState(false);
  const [ professionalSkillsCoach, setProfessionalSkillsCoach ] = useState(false);
  const [ hostSiteVisit, setHostSiteVisit ] = useState(false);
  const [ industrySpeaker, setIndustrySpeaker ] = useState(false);
  

  const getLoggedInUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/is_logged');
      setLoggedUser(data.payload);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        history.push('/');
      } else {
        setFeedback(err);
      }
    }
  }

  useEffect(() => {
    getLoggedInUser();
  }, []);

  const setUser = (user) => {
    setLoggedUser(user);
  }

  const logout = async () => {
    try {
      await axios.get('/api/auth.logout');
      setLoggedUser(null);
    } catch (err) {
      setFeedback(err);
    }
  }

  const resetFeedback = () => {
    setFeedback(null);
  }

  const loginSignupProps = {
    formType,
    userType,
    setFormType,
    setUserType
  }

  const profileProps = {
    loggedUser,
    setFeedback,
    setUser,

    email,
    password,
    firstName,
    lastName,
    newPassword,
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

    setEmail,
    setPassword,
    setFirstName,
    setLastName,
    setNewPassword,
    setCohortId,
    setCompany,
    setTitle,
    setVolunteerSkills,
    setMentor,
    setOfficeHours,
    setTechMockInterview,
    setBehavioralMockInterview,
    setProfessionalSkillsCoach,
    setHostSiteVisit,
    setIndustrySpeaker
  }


  return (
    <div className="container-md mt-4">
      <NavBar loggedUser={loggedUser} logout={logout} />
      <Switch>
        <Route exact path='/'> 
          <LoginSignup {...loginSignupProps} {...profileProps} />
        </Route>

        <Route path='/profile'> 
          <ProfilePage {...profileProps} />
        </Route>

        {
          loggedUser && loggedUser.a_id
          ? <Route path='/tools'>
              <AdminTools loggedUser={loggedUser} setFeedback={setFeedback} />
            </Route>
          : null
        }

        <Route path='/volunteers/search'> 
          <VolunteerSearch />
        </Route>
      </Switch>

      {
        (feedback)
        ? <Feedback feedback={feedback} resetFeedback={resetFeedback}/>
        : null
      }
    </div>
  );
}

export default App;
