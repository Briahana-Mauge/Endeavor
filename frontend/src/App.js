/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
APP MAIN | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

import './App.scss';
import LoginSignupGate from './Components/LoginSignupGate';
import PrivateRouteGate from './Components/PrivateRouteGate';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ProfilePage from './Components/Profile/ProfilePage';
import VolunteerSearch from './Components/VolunteerSearch';
import AdminTools from './Components/AdminTools/AdminTools';
import ProfileRender from './Components/ProfilePages/ProfileRender';
import Feedback from './Components/Feedback';


function App() {
  // USER states
  const [ loggedUser, setLoggedUser ] = useState({});
  const [ isUserStateReady, setIsUserStateReady ] = useState(false);
  const [ feedback, setFeedback ] = useState(null);

  // LOGIN/SIGNUP states
  const [ formType, setFormType ] = useState('login');
  const [ userType, setUserType ] = useState('');

  // LOGIN/SIGNUP & PROFILE states
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

  const location = useLocation();
  const history = useHistory();

  const checkForLoggedInUser = async () => {
    const { data } = await axios.get('/api/auth/is_logged');
    return data.payload;
  }

  useEffect(() => {
      checkForLoggedInUser()
        .then(settleUser)
        .catch (err => {
            if (err.response && err.response.status === 401) {
              setIsUserStateReady(true);
              history.push('/', { from: location });
            } else {
              setFeedback(err);
            }
        })
      ;
  }, [history]);

  const settleUser = (user) => {
    setLoggedUser(user);
    setIsUserStateReady(true);
  }

  const logout = () => {
    setIsUserStateReady(false);
    axios.get('/api/auth/logout')
      .then(res => {
        settleUser({}); // async await sometimes didn't execute this so switched to .then.catch
      })
      .catch (err => setFeedback(err));
  }

  const resetFeedback = () => {
    setFeedback(null);
  }


  /* PREP RETURN */
  const gateProps = {
    loggedUser,
    isUserStateReady
  }
  const navProps = {
    loggedUser,
    logout
  }
  const userProps = {
    loggedUser,
    setFeedback,
    settleUser
  };
  const signupProps = {
    formType, setFormType,
    userType, setUserType
  };
  const profileProps = {
    email, setEmail,
    password, setPassword,
    newPassword, setNewPassword,
    firstName, setFirstName,
    lastName, setLastName,
    cohortId, setCohortId,
    company, setCompany,
    title, setTitle,
    volunteerSkills, setVolunteerSkills,
    mentor, setMentor,
    officeHours, setOfficeHours,
    techMockInterview, setTechMockInterview,
    behavioralMockInterview, setBehavioralMockInterview,
    professionalSkillsCoach, setProfessionalSkillsCoach,
    hostSiteVisit, setHostSiteVisit,
    industrySpeaker, setIndustrySpeaker
  }
  let showAdmins = null;
  if (loggedUser && loggedUser.a_id) {
    showAdmins = (
      <Route path='/tools'>
        <NavBar {...navProps} />
        <AdminTools {...userProps} />
      </Route>
    );
  }


  return (
    <div className=".container-fluid p-3 mt-4">
      <Switch>

        <Route exact path='/'>
          <LoginSignupGate {...gateProps}>
            <LoginSignup {...userProps} {...signupProps} {...profileProps} />
          </LoginSignupGate>
        </Route>

        <PrivateRouteGate path='/home' {...gateProps}>
          <NavBar {...navProps} />
          <Dashboard />
        </PrivateRouteGate>

        <PrivateRouteGate path='/profile' {...gateProps}>
          <NavBar {...navProps} />
          <ProfilePage {...userProps} {...profileProps} />
        </PrivateRouteGate>

        {showAdmins}

        <PrivateRouteGate path='/volunteers/search' {...gateProps}>
          <NavBar {...navProps} />
          <VolunteerSearch {...userProps} />
        </PrivateRouteGate>

        <PrivateRouteGate path='/volunteers/:volunteerId' {...gateProps}> 
          <NavBar {...navProps} />
          <ProfileRender {...userProps} />
        </PrivateRouteGate>

        <PrivateRouteGate path='/events/search' {...gateProps}> 
          <EventsSearch {...userProps} />
        </PrivateRouteGate>
    
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
