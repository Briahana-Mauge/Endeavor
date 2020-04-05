import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import LoginSignup from './Components/LoginSignup';
import ErrorFeedback from './Components/ErrorFeedback';
import VolunteerSearch from './Components/VolunteerSearch';

function App() {
  const history = useHistory();

  const [ loggedUser, setLoggedUser ] = useState({});
  const [ networkError, setNetworkError ] = useState(null);

  const getLoggedInUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/is_logged');
      setLoggedUser(data.payload);
      history.push('/home');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('User not logged in yet');
      } else {
        setNetworkError(err);
      }
    }
  }

  useEffect(() => {
    getLoggedInUser()
  }, []);

  const setUser = (user) => {
    setLoggedUser(user);
    history.push('/home');
  }

  const logout = () => {
    setLoggedUser('');
    history.push('/')
  }

  const resetNetworkError = () => {
    setNetworkError(null);
  }


  return (
    <div className="container-md">
      <Switch>
        <Route exact path='/'> 
          <LoginSignup setNetworkError={setNetworkError} setUser={setUser}/>
        </Route>
        <Route path='/volunteers/search'> 
          <VolunteerSearch />
        </Route>
      </Switch>
      
      {
        (networkError)
        ? <ErrorFeedback err={networkError} resetNetworkError={resetNetworkError}/>
        : null
      }
    </div>
  );
}

export default App;
