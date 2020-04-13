/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
APP MAIN | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import './App.scss';
import LoginSignupGate from './Components/LoginSignupGate';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import PrivateRouteGate from './Components/PrivateRouteGate';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import ProfilePage from './Components/Profile/ProfilePage';
import AdminTools from './Components/AdminTools/AdminTools';
import VolunteerSearch from './Components/VolunteerSearch';
import Feedback from './Components/Feedback';


const App = () => {
  const [ loggedUser, setLoggedUser ] = useState({});
  const [ currentRole, setCurrentRole ] = useState("");
  const [ isUserStateReady, setIsUserStateReady ] = useState(false);
  const [ feedback, setFeedback ] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const checkForLoggedInUser = async () => {
      const response = await axios.get('/api/auth/is_logged');
      return response.data.payload;
    };
    checkForLoggedInUser()
      .then(setUser)
      .catch(err => {
        if (err.response && err.response.status === 401) {
          setIsUserStateReady(true);
          history.push('/');
        } else {
          setFeedback(err);
        }
      })
    ;
  }, [history]);


  const setUser = (user) => {
    setLoggedUser(user);
    setCurrentRole(user.role);
    setIsUserStateReady(true);
  }

  const logout = async () => {
    try {
      setIsUserStateReady(false);
      await axios.get('/api/auth/logout');
      // setUser({}); // this might not be needed or working because server request.logOut() seems to reload page?
    } catch (err) {
      setFeedback(err);
    }
  }

  const resetFeedback = () => {
    setFeedback(null);
  }


  /* PREP RETURN */
  const gateProps = {
    currentRole,
    isUserStateReady
  }
  const navProps = {
    loggedUser,
    logout
  }
  const userProps = {
    loggedUser,
    setUser,
    setFeedback,
  }
  let showAdmins = null;
  if (loggedUser && loggedUser.a_id) {
    showAdmins = (
      <Route path='/tools'>
        <PrivateRouteGate {...gateProps}>
          <NavBar {...navProps} />
          <AdminTools loggedUser={loggedUser} setFeedback={setFeedback} />
        </PrivateRouteGate>
      </Route>
    );
  }


  return (
    <div className="container-md mt-4">
      <Switch>
        <Route exact path='/'>
          <LoginSignupGate {...gateProps}>
            <LoginSignup {...userProps} />
          </LoginSignupGate>
        </Route>

        <Route path='/home'>
          <PrivateRouteGate {...gateProps}>
            <NavBar {...navProps} />
            <Dashboard />
          </PrivateRouteGate>
        </Route>

        <Route path='/profile'>
          <PrivateRouteGate {...gateProps}>
            <NavBar {...navProps} />
            <ProfilePage {...userProps} />
          </PrivateRouteGate>
        </Route>

        {showAdmins}

        <Route path='/volunteers/search'>
          <PrivateRouteGate {...gateProps}>
            <NavBar {...navProps} />
            <VolunteerSearch />
          </PrivateRouteGate>
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
