/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EventsDashVolunteers from './EventsDash/EventsDashVolunteers';
import EventCard from '../EventCard';

import { Bar,defaults} from 'react-chartjs-2';
// defaults.global.defaultColor = 'white';

const Dashboard = (props) => {
  const { setFeedback, loggedUser } = props;

  const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [] });
  const [showEvent, setShowEvent] = useState(false);
  const [targetEvent, setTargetEvent] = useState({});
  const [volunteeredTime, setVolunteeredTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [reloadDashboard, setReloadDashboard] = useState(false);

  const [barData, setBarData] = useState({
    labels: ['Volunteer hours earned', 'Events attended'],
    datasets: [
      {
        label: 'You',
        data: [1,2, 7, 8],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          
        ],
        borderWidth: 2
      },
      {
        label: 'All volunteers',
        data: [2,5,10],
        backgroundColor: [
          
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 2
      }
    ]
  });
  const [barOptions, setBarOptions] = useState({
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }
        ],
        xAxes: [{
          ticks: {
              fontColor: 'white',
              beginAtZero: true
          }
      }]
      },
      title: {
        display: true,
        text: 'Personal Stats',
        fontSize: 25,
        fontColor: 'white'
      },
      legend: {
        display: true,
        position: 'top',
        labels:{
          fontColor:'white'
        }
        
      },
      datalabels: {
        display: true,
        fontColor: 'white',
      }
    }
  });


  let vDataArr = [volunteeredTime, eventsObj.pasts.length,]
  let aDataArr = [totalTime, totalEvents]

  barData.datasets[0].data = vDataArr
  barData.datasets[1].data = aDataArr

  const getAllVolunteeredTime = () => {
    axios.get(`/api/time/hours/${loggedUser.v_id}`)
      .then(res => setVolunteeredTime(res.data.payload.sum))
      .catch(err => setFeedback(err));
    
      axios.get('/api/time/')
      .then(res => setTotalTime(parseInt(res.data.payload[0].sum)))
      .catch(err => setFeedback(err));
  }
  useEffect(getAllVolunteeredTime, []);

  useEffect(() => {
    const getEventsData = () => {
      axios.get(`/api/events/dashboard/volunteer`)
        .then(res => setEventsObj(res.data.payload))
        .catch(err => setFeedback(err));
        
      axios.get('/api/events/past')
        .then(res => setTotalEvents(parseInt(res.data.payload[0].count)))
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
          {/* <h3>Personal Stats</h3>
          <br />

          {
            eventsObj.upcomings.length === 0
              ? <p>You are not registered to volunteer at any upcoming events. Visit the Events page to find out more!</p>
              : null
          } */}
          {/* <p>You've got {volunteeredTime} volunteer hours!</p>
          {
            eventsObj.pasts.length < 1
              ? <p>You haven't participated in any events yet.</p>
              : eventsObj.pasts.length > 1
                ? <p>So far, you've participated in {eventsObj.pasts.length} events.</p>
                : <p>So far, you've participated in {eventsObj.pasts.length} event.</p>
          } */}
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

      <div class="col-12 col-md-7">
        <Bar data={barData} options={barOptions.options} />
      </div>

    </div>
  )
}

export default Dashboard;