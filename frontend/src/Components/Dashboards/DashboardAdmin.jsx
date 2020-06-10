/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AdminEDash from './EventsDash/AdminEDash';
import NewVolunteersDash from './NewVolunteersDash/NewVolunteersDash';
import ChartsAdmin from './ChartsAdmin';

const DashboardAdmin = (props) => {
  const { setFeedback, loggedUser } = props;

  const [newVolunteers, setNewVolunteers] = useState([]);
  const [eventsObj, setEventsObj] = useState({ todays: [], upcomings: [], hours: [], events: [], volunteers: [] });
  // const [showEvent, setShowEvent] = useState(false);
  // const [targetEvent, setTargetEvent] = useState({});
  const [reloadDashboard, setReloadDashboard] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getNewVolunteers = () => {
      axios.get('/api/volunteers/new')
        .then(response => {
          if (isMounted) {
            setNewVolunteers(response.data.payload)
          }
        })
        .catch(err => {
          if (isMounted) {
            setFeedback(err)
          }
        });
    }
    const getEvents = () => {
      axios.get('/api/events/dashboard/admin')
        .then(response => {
          if (isMounted) {
            setEventsObj(response.data.payload)
          }
        })
        .catch(err => {
          if (isMounted) {
            setFeedback(err)
          }
        });
    }
    getNewVolunteers();
    getEvents();

    // Cleanup
    return () => isMounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadDashboard]);


  // PRE-RETURN (package drilled props)
  const newVolunteersProps = {
    reloadDashboard,
    setReloadDashboard,
    setFeedback
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-5 pr-md-2">
          <AdminEDash events={eventsObj} loggedUser={loggedUser}/>
        </div>

        <div className="col-12 col-md-7 pl-md-2">
          <NewVolunteersDash newVolunteers={newVolunteers} {...newVolunteersProps} />
        </div>
      </div>

      <ChartsAdmin chartData={[eventsObj]} />
    </>
  )
}


export default DashboardAdmin;
