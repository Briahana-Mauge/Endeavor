/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EventsDashVolunteers from './EventsDash/EventsDashVolunteers';
import EventCard from '../EventCard';
import Charts from './Charts'


const Dashboard = (props) => {
  const { setFeedback, loggedUser } = props;

  const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [], pastData: [] });
  const [showEvent, setShowEvent] = useState(false);
  const [targetEvent, setTargetEvent] = useState({});
  const [reloadDashboard, setReloadDashboard] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const getEventsData = async () => {
      axios.get(`/api/events/dashboard/volunteer`)
        .then(res => {setEventsObj(res.data.payload); setChartData(res.data.payload.pastData)})
        .catch(err => setFeedback(err));
    }
    getEventsData();

  }, [reloadDashboard, loggedUser.v_id, setFeedback]);


  const hideEvent = () => {
    setTargetEvent({});
    setShowEvent(false);
  }


  // PRE-RETURN (package drilled props)
  const eventsDashProps = {
    loggedUser,
    setShowEvent,
    targetEvent,
    setTargetEvent
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-5">
          <EventsDashVolunteers events={eventsObj} {...eventsDashProps} />
        </div>

        <div className="col-12 col-md-7">
          <Charts 
            chartData={chartData} 
            hoursText={"Volunteer Hours I've Earned in a Year"} 
            eventsText={"Events I've Participated in for a Year"} />
        </div>

      </div>

      {
        showEvent
          ? <EventCard
            loggedUser={loggedUser}
            event={targetEvent}
            setFeedback={setFeedback}
            reloadParent={reloadDashboard}
            setReloadParent={setReloadDashboard}
            hideEvent={hideEvent}
          />
          : null
      }



    </div>
  )
}

export default Dashboard;