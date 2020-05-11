/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

import EventsDashVolunteers from './EventsDash/EventsDashVolunteers';
import EventCard from '../EventCard';
import { PrimaryModalContainer } from '../Modals/PrimaryModal';

const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


const DashboardVolunteers = (props) => {
  const { setFeedback, loggedUser } = props;

  const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [] });
  const [showEvent, setShowEvent] = useState(false);
  const [targetEvent, setTargetEvent] = useState({});
  const [volunteeredTime, setVolunteeredTime] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [reloadDashboard, setReloadDashboard] = useState(false);

  // Chart for volunteer hours
  const [volunteerData, setVolunteerData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Hours',
        data: [],
        backgroundColor: Array(12).fill('rgba(255, 99, 132, 1)'),
        borderWidth: 2
      }
    ]
  });
  const [hourOptions, setHourOptions] = useState({
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
        text: `Volunteer Hours I've Earned in ${new Date().getFullYear()} `,
        fontSize: 25,
        fontColor: 'white'
      },
      legend: {
        display: false,
        position: 'top',
        labels: {
          fontColor: 'white'
        }

      },
      datalabels: {
        display: true,
        fontColor: 'white',
      }
    }
  });
  let hours = Array(12).fill(0)
  for (let i = 0; i < volunteeredTime.length; i++) {
    hours[volunteeredTime[i].months - 1] = volunteeredTime[i].hours
  }
  volunteerData.datasets[0].data = hours

//Chart for number of events
  const [eventData, setEventData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Events',
        data: [],
        backgroundColor: Array(12).fill('rgba(155, 49, 117, 1)'),
        borderWidth: 2
      }
    ]
  });
  const [eventOptions, setEventOptions] = useState({
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
        text: `Events I've Participated in for ${new Date().getFullYear()} `,
        fontSize: 25,
        fontColor: 'white'
      },
      legend: {
        display: false,
        position: 'top',
        labels: {
          fontColor: 'white'
        }

      },
      datalabels: {
        display: true,
        fontColor: 'white',
      }
    }
  });

  let events = Array(12).fill(0)
  for (let i = 0; i < totalEvents.length; i++) {
    events[totalEvents[i].months - 1] = totalEvents[i].number
  }
  eventData.datasets[0].data = events


  const getAllVolunteeredTime = () => {
    axios.get(`/api/time/hours/${loggedUser.v_id}`)
      .then(res => setVolunteeredTime(res.data.payload))
      .catch(err => setFeedback(err));
  }
  useEffect(getAllVolunteeredTime, []);

  useEffect(() => {
    const getEventsData = async () => {
      axios.get(`/api/events/dashboard/volunteer`)
        .then(res => setEventsObj(res.data.payload))
        .catch(err => setFeedback(err));

      axios.get(`/api/events/past/volunteer/${loggedUser.v_id}`)
        .then(res => setTotalEvents(res.data.payload))
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
    <>

      <div className="row">
          <div className="col-12 col-md-5">
            <EventsDashVolunteers events={eventsObj} {...eventsDashProps} />
          </div>

          <div className="col-12 col-md-7">
            <Bar data={volunteerData} options={hourOptions.options} />
            <Bar data={eventData} options={eventOptions.options} />
          </div>
      </div>

      <PrimaryModalContainer header={targetEvent.topic || ''} hideEvent={hideEvent}>
        {
          showEvent
            ? <EventCard
                loggedUser={loggedUser}
                event={targetEvent}
                setFeedback={setFeedback}
                reloadParent={reloadDashboard}
                setReloadParent={setReloadDashboard}
                // hideEvent={hideEvent}
              />
            : null
        }
      </PrimaryModalContainer>

    </>
  )
}


export default DashboardVolunteers;
