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
import PrivateGate from './Components/PrivateGate';
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
import EventRender from './Components/EventRender';
import Feedback from './Components/Feedback';
import PageNotFound from './Components/PageNotFound';

const identifyUser = require('./helpers/identifyUser');



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

  // SEARCH states
  const [isVolunteerSearchGrided, setIsVolunteerSearchGrided] = useState(false);
  const [isEventSearchGrided, setIsEventSearchGrided] = useState(false);

  // OTHER variables
  const userIs = identifyUser(loggedUser);
  const location = useLocation();
  const history = useHistory();

  // USEEFFECT
  useEffect(() => {
    let isMounted = true;
    axios.get('/api/auth/is_logged')
      .then(res => {
        if (isMounted) {
          settleUser(res.data.payload);
          setIsVolunteerSearchGrided(res.data.payload.v_grid);
          setIsEventSearchGrided(res.data.payload.e_grid);
        }
      })
      .catch(err => {
          if (isMounted && err.response && err.response.status === 401) {
            setIsUserStateReady(true);
            history.push('/login', { from: location });
            setWait(false);
          } else if(isMounted) {
            setFeedback(err);
          }
      });

    //cleanup
    return () => isMounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* HELPER FUNCTIONS */
  const settleUser = (user) => {
    setLoggedUser(user);
    setIsVolunteerSearchGrided(user.v_grid);
    setIsEventSearchGrided(user.e_grid);
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
  const searchProps = {
    isVolunteerSearchGrided, setIsVolunteerSearchGrided,
    isEventSearchGrided, setIsEventSearchGrided
  }


  /* BUILD LIMITED ACCESS ROUTES */
  const
    adminDashboard = <DashboardAdmin {...userProps} />,
    staffDashboard = <DashboardStaff {...userProps} />,
    volunteersDashboard = <DashboardVolunteers {...userProps} />,
    fellowsDashboard = <DashboardFellows {...userProps} />,
    volunteersHome = (
      <PrivateGate path='/volunteers' h1='Volunteers List' {...gateProps}>
        <Volunteers {...userProps} {...searchProps} />
      </PrivateGate>
    ),
    volunteersProfile = (
      <PrivateGate path='/volunteer/:volunteerId' h1='Volunteer Profile' {...gateProps}>
        <ProfileRender {...userProps} />
      </PrivateGate>
    ),
    fellowsProfile = (
      <PrivateGate path='/fellow/:fellowId' h1='Fellow Profile' {...gateProps}>
        <ProfileRender {...userProps} />
      </PrivateGate>
    ),
    adminTools = (
      <PrivateGate path='/tools' h1='Admin Settings' {...gateProps}>
        <AdminTools {...userProps} />
      </PrivateGate>
    ),
    adminAddEventForm = (
      <PrivateGate path='/event/add' h1='Add Event' {...gateProps}>
        <EventForm {...userProps} />
      </PrivateGate>
    ),
    adminEditEventForm = (
      <PrivateGate path='/event/edit/:eventId' h1='Edit Event' {...gateProps}>
        <EventForm {...userProps} />
      </PrivateGate>
    ),
    mentorManagement = (
      <PrivateGate path='/mentoring/volunteer/:volunteerId' {...gateProps}>
        <Mentoring {...userProps} />
      </PrivateGate>
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

  if (userIs.volunteer) {
    allowedDashboard = volunteersDashboard;
    allowedVolunteersProfile = volunteersProfile;
  }
  if (userIs.staff) {
    allowedDashboard = staffDashboard;
  }
  if (userIs.admin || userIs.staff) {
    allowedVolunteersHome = volunteersHome;
    allowedVolunteersProfile = volunteersProfile;
    allowedFellowsProfile = fellowsProfile;
    allowedAddEvent = adminAddEventForm;
    allowedEditEvent = adminEditEventForm;
    allowedMentorManagement = mentorManagement;
  }
  if (userIs.admin) {
    allowedDashboard = adminDashboard;
    allowedAdminTools = adminTools;
  }
  if (userIs.fellow) {
    allowedDashboard = fellowsDashboard;
  }

  if (wait) {
    return <h1 className='text-center text-danger'>this will be a spinner</h1>
  }


  return (
    <div className="g1App container">
      <Switch>

        <PrivateGate exact path='/' h1={userIs.admin ? 'Dashboard' : 'Home'} {...gateProps}>
          {allowedDashboard}
        </PrivateGate>

        <PrivateGate path='/profile' h1='My Profile' {...gateProps}>
          <ProfilePage {...userProps} {...profileProps} resetState={resetState}/>
        </PrivateGate>


        {/* // EVENTS PAGES */}
        {allowedAddEvent}             {/* '/event/add' */}
        {allowedEditEvent}            {/* '/event/edit/:eventId' */}

        <PrivateGate path='/event/:eventId' h1='Event' {...gateProps}>
          <EventRender {...userProps} />
        </PrivateGate>

        <PrivateGate path='/events' h1='Events List' {...gateProps}>
          <Events {...userProps} {...searchProps} />
        </PrivateGate>


        {allowedVolunteersHome}       {/* '/volunteers' */}
        {allowedVolunteersProfile}    {/* '/volunteer/:volunteerId' */}

        {allowedFellowsProfile}       {/* '/fellow/:fellowId' */}

        {allowedAdminTools}           {/* '/tools' */}

        {allowedMentorManagement}     {/* '/mentoring/volunteer/:volunteerId' */}


        <Route path='/login'>
          <LoginSignupGate {...gateProps}>
            <LoginSignup {...userProps} {...signupProps} {...profileProps} />
          </LoginSignupGate>
        </Route>

        {/* CATCHALL */}
        <PrivateGate path='/404' h1='Page Not Found' {...gateProps}>
          <PageNotFound />
        </PrivateGate>

        <Redirect to='/404' />  

      </Switch>

      <Feedback feedback={feedback} resetFeedback={resetFeedback} />

    </div>
  );
}


export default App;
