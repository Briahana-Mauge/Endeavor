/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EventsDashVolunteers from './EventsDash/EventsDashVolunteers';
import EventCard from '../EventCard';
// import EventPreviewCard from '../EventPreviewCard';

import { Bar, Pie, Line } from 'react-chartjs-2';

const Dashboard = (props) => {
  const { setFeedback, loggedUser } = props;

  const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [] });
  const [showEvent, setShowEvent] = useState(false);
  const [targetEvent, setTargetEvent] = useState({});
  const [volunteeredTime, setVolunteeredTime] = useState(0);
  const [reloadDashboard, setReloadDashboard] = useState(false);

  const [barData, setBarData] = useState({
    labels: ['volunteer hours', 'label 2', 'label 3', 'label 4'],
    datasets: [
      {
        label: 'test label',
        data: [
          { volunteeredTime },
          `${eventsObj.pasts.length}`,
          73,
          82
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 3
      }
    ]
  });
  const [barOptions, setBarOptions] = useState({
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      title: {
        display: true,
        text: 'Data Orgranized In Bars',
        fontSize: 25
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  });

  console.log(eventsObj.pasts.length)

  let dataArr = [volunteeredTime, 2, volunteeredTime, eventsObj.pasts.length,]
  for(let i = 0; i<4; i++){
  barData.datasets[0].data[i] = dataArr[i]
   }
   
  // barData.datasets[0].data[0] = volunteeredTime

  const getAllVolunteeredTime = () => {
    axios.get(`/api/time/hours/${loggedUser.v_id}`)
      .then(res => setVolunteeredTime(res.data.payload.sum))
      .catch(err => setFeedback(err));
  }
  useEffect(getAllVolunteeredTime, []);

  useEffect(() => {
    const getEventsData = () => {
      axios.get(`/api/events/dashboard/volunteer`)
        .then(res => setEventsObj(res.data.payload))
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
          <h3>Personal Stats</h3>
          <br />

          {
            eventsObj.upcomings.length === 0
              ? <p>You are not registered to volunteer at any upcoming events. Visit the Events page to find out more!</p>
              : null
          }
          <p>You've got {volunteeredTime} volunteer hours!</p>
          {
            eventsObj.pasts.length < 1
              ? <p>You haven't participated in any events yet.</p>
              : eventsObj.pasts.length > 1
                ? <p>So far, you've participated in {eventsObj.pasts.length} events.</p>
                : <p>So far, you've participated in {eventsObj.pasts.length} event.</p>
          }
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

      <div>
        <Line data={barData} options={barOptions.options} />
      </div>

    </div>
  )
}

export default Dashboard;