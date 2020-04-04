import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LoginSignup from './Components/LoginSignup';
import Routing from './Components/Routing';
import ErrorFeedback from './Components/ErrorFeedback';

function App() {
  const [ loggedUser, setLoggedUser ] = useState({});
  const [ networkError, setNetworkError ] = useState(null);

  const getLoggedInUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/is_logged');
      setLoggedUser(data.payload);
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
  }

  const resetNetworkError = () => {
    setNetworkError(null);
  }


  return (
    <div className="container-md">
      {
        (networkError)
        ? <ErrorFeedback err={networkError} resetNetworkError={resetNetworkError}/>
        : null
      }
      {
        (loggedUser.a_id || loggedUser.v_id || loggedUser.f_id)
        ? <Routing err={networkError} resetNetworkError={resetNetworkError}/>
        : <LoginSignup err={networkError} resetNetworkError={resetNetworkError} setUser={setUser}/>
      }
    </div>
  );
}

export default App;
