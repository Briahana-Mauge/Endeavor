/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
APP MAIN | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import './App.scss';
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
  const [ feedback, setFeedback ] = useState(null);

  // LOGIN/SIGNUP states
  const [ formType, setFormType ] = useState('login');
  const [ userType, setUserType ] = useState('');

  // LOGIN/SIGNUP & PROFILE states
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
              history.push('/');
            } else {
              setFeedback(err);
            }
        })
      ;
  }, []);

  const settleUser = (user) => {
    setLoggedUser(user);
  }

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setLoggedUser({});
    } catch (err) {
      setFeedback(err);
    }
  }

  const resetFeedback = () => {
    setFeedback(null);
  }


  /* PREP RETURN */
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
          <LoginSignup {...userProps} {...signupProps} {...profileProps} />
        </Route>

        <Route path='/home'>
          <NavBar {...navProps} />
          <Dashboard />
        </Route>

        <Route path='/profile'>
          <NavBar {...navProps} />
          <ProfilePage {...userProps} {...profileProps} />
        </Route>

        {showAdmins}

        <Route path='/volunteers/search'> 
          <VolunteerSearch loggedUser={loggedUser} setFeedback={setFeedback} />
        </Route>

        <Route path='/volunteers/:volunteerId'> 
          <ProfileRender loggedUser={loggedUser} setFeedback={setFeedback} />
=======
        <Route path='/volunteers/search'>
          <NavBar {...navProps} />
          <VolunteerSearch {...userProps} />
        </Route>

        <Route path='/volunteers/:volunteerId'> 
          <NavBar {...navProps} />
          <ProfileRender {...userProps} />
>>>>>>> 98c4e48f5036c380df66596d3a8dd945a89da8fc
        </Route>

        <Route exact path='/events/search'> 
          <EventsSearch />
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
