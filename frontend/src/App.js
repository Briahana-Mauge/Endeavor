/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
APP MAIN | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation, useHistory, Redirect } from 'react-router-dom';
import axios from 'axios';

import './App.scss';
import LoginSignupGate from './Components/LoginSignupGate';
import PrivateRouteGate from './Components/PrivateRouteGate';
import DashboardAdmin from './Components/Dashboards/DashboardAdmin';
import DashboardStaff from './Components/Dashboards/DashboardStaff';
import DashboardVolunteers from './Components/Dashboards/DashboardVolunteers';
import DashboardFellows from './Components/Dashboards/DashboardFellows';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import ProfilePage from './Components/Profile/ProfilePage';
import Volunteers from './Components/Volunteers';
import Events from './Components/Events';
import EventForm from './Components/EventForm';
import AdminTools from './Components/AdminTools/AdminTools';
import ProfileRender from './Components/ProfilePages/ProfileRender';
import Mentoring from './Components/Mentoring';
import Feedback from './Components/Feedback';


function App() {
  // APP State
  const [wait, setWait] = useState(true);

  // USER states
  const [loggedUser, setLoggedUser] = useState({});
  const [isUserStateReady, setIsUserStateReady] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // LOGIN/SIGNUP states
  const [formType, setFormType] = useState('login');
  const [userType, setUserType] = useState('');

  // LOGIN/SIGNUP & PROFILE states
  const [email, setEmail] = useState('alexis@pursuit.org');
  const [password, setPassword] = useState('1234');
  const [newPassword, setNewPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cohortId, setCohortId] = useState(0);
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [volunteerSkills, setVolunteerSkills] = useState([]);
  const [mentor, setMentor] = useState(false);
  const [officeHours, setOfficeHours] = useState(false);
  const [techMockInterview, setTechMockInterview] = useState(false);
  const [behavioralMockInterview, setBehavioralMockInterview] = useState(false);
  const [professionalSkillsCoach, setProfessionalSkillsCoach] = useState(false);
  const [hostSiteVisit, setHostSiteVisit] = useState(false);
  const [industrySpeaker, setIndustrySpeaker] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);

  const location = useLocation();
  const history = useHistory();

  const checkForLoggedInUser = () => {
    axios.get('/api/auth/is_logged')
      .then(res => settleUser(res.data.payload))
      .catch(err => {
          if (err.response && err.response.status === 401) {
            setIsUserStateReady(true);
            history.push('/login', { from: location });
            setWait(false);
          } else {
            setFeedback(err);
          }
      });
  }
  useEffect(checkForLoggedInUser, []);


  const settleUser = (user) => {
    setLoggedUser(user);
    setIsUserStateReady(true);
    setWait(false);
  }

  const resetState = () => {
    settleUser({});
    history.push('/login');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setFirstName('');
    setLastName('');
    setCohortId(0);
    setCompany('');
    setTitle('');
    setVolunteerSkills([]);
    setMentor(false);
    setOfficeHours(false);
    setTechMockInterview(false);
    setBehavioralMockInterview(false);
    setProfessionalSkillsCoach(false);
    setHostSiteVisit(false);
    setIndustrySpeaker(false);
    setPublicProfile(false);
  }

  const logout = () => {
    setIsUserStateReady(false);
    axios.get('/api/auth/logout')
      .then(res => resetState())
      .catch(err => setFeedback(err));
  }

  const resetFeedback = () => {
    setFeedback(null);
  }


  /* PROP GROUPINGS */
  const gateProps = {
    loggedUser,
    isUserStateReady,
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
    industrySpeaker, setIndustrySpeaker,
    publicProfile, setPublicProfile
  }


  /* BUILD LIMITED ACCESS ROUTES */
  const
    adminDashboard = <DashboardAdmin {...userProps} />,
    staffDashboard = <DashboardStaff {...userProps} />,
    volunteersDashboard = <DashboardVolunteers {...userProps} />,
    fellowsDashboard = <DashboardFellows {...userProps} />,
    volunteersHome = (
      <PrivateRouteGate path='/volunteers' h1='Volunteers List' {...gateProps}>
        <Volunteers {...userProps} />
      </PrivateRouteGate>
    ),
    volunteersProfile = (
      <PrivateRouteGate path='/volunteer/:volunteerId' h1='Volunteer Profile' {...gateProps}>
        <ProfileRender {...userProps} />
      </PrivateRouteGate>
    ),
    fellowsProfile = (
      <PrivateRouteGate path='/fellow/:fellowId' h1='Fellow Profile' {...gateProps}>
        <ProfileRender {...userProps} />
      </PrivateRouteGate>
    ),
    adminTools = (
      <PrivateRouteGate path='/tools' h1='Admin Settings' {...gateProps}>
        <AdminTools {...userProps} />
      </PrivateRouteGate>
    ),
    adminAddEventForm = (
      <PrivateRouteGate path='/event/add' h1='Add Event' {...gateProps}>
        <EventForm {...userProps} />
      </PrivateRouteGate>
    ),
    adminEditEventForm = (
      <PrivateRouteGate path='/event/edit/:eventId' h1='Edit Event' {...gateProps}>
        <EventForm {...userProps} />
      </PrivateRouteGate>
    ),
    mentorManagement = (
      <PrivateRouteGate path='/mentoring/volunteer/:volunteerId' {...gateProps}>
        <Mentoring {...userProps} />
      </PrivateRouteGate>
    )
  ;


  /* TOGGLE LIMITED ROUTE ACCESSES */
  let
    allowedDashboard = <div>You need to to logged in to view this content</div>, // OR maybe we can default it to the what's new / events to general public
    allowedVolunteersHome = null,
    allowedVolunteersProfile = null,
    allowedFellowsProfile = null,
    allowedAdminTools = null,
    allowedAddEvent = null,
    allowedEditEvent = null,
    allowedMentorManagement = null
  ;

  const appRoute = {};
  if (loggedUser && loggedUser.admin) {
    appRoute["admin"] = true;
  } else if (loggedUser && loggedUser.a_id) {
    appRoute["staff"] = true;
  } else if (loggedUser && loggedUser.v_id) {
    appRoute["volunteer"] = true;
  } else if (loggedUser && loggedUser.f_id) {
    appRoute["fellow"] = true;
  }

  if (appRoute.volunteer) {
    allowedDashboard = volunteersDashboard;
    allowedVolunteersProfile = volunteersProfile; // Temporarily here to see how it looks like on the volunteers side
  }
  if (appRoute.staff) {
    allowedDashboard = staffDashboard;
  }
  if (appRoute.admin || appRoute.staff) {
    allowedVolunteersHome = volunteersHome;
    allowedVolunteersProfile = volunteersProfile;
    allowedFellowsProfile = fellowsProfile;
    allowedAddEvent = adminAddEventForm;
    allowedEditEvent = adminEditEventForm;
    allowedMentorManagement = mentorManagement;
  }
  if (appRoute.admin) {
    allowedDashboard = adminDashboard;
    allowedAdminTools = adminTools;
  }
  if (appRoute.fellow) {
    allowedDashboard = fellowsDashboard;
  }

  if (wait) {
    return <h1 className='text-center text-danger'>this will be a spinner</h1>
  }


  return (
    <div className="g1App container">
      <Switch>

        <PrivateRouteGate exact path='/' h1='Home' {...gateProps}>
          {allowedDashboard}
        </PrivateRouteGate>

        <PrivateRouteGate path='/profile' h1='My Profile' {...gateProps}>
          <ProfilePage {...userProps} {...profileProps} resetState={resetState}/>
        </PrivateRouteGate>

        <PrivateRouteGate path='/events' h1='Events List' {...gateProps}>
          <Events {...userProps} />
        </PrivateRouteGate>

        {allowedVolunteersHome}
        {allowedVolunteersProfile}

        {allowedFellowsProfile}

        {allowedAdminTools}
        {allowedAddEvent}
        {allowedEditEvent}
        {allowedMentorManagement}

        {/* PUBLIC ROUTE: LOGIN/SIGNUP + CATCHALL */}
        <Route path='/login'>
          <LoginSignupGate {...gateProps}>
            <LoginSignup {...userProps} {...signupProps} {...profileProps} />
          </LoginSignupGate>
        </Route>

        <Route path='/404'>
          <h1 className='text-center'>We can have a message here or a 404 page</h1>
        </Route>

        <Redirect to='/404' />  

      </Switch>

      {
        (feedback)
          ? <Feedback feedback={feedback} resetFeedback={resetFeedback} />
          : null
      }
    </div>
  );
}


export default App;
