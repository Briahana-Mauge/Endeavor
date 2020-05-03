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

const Dashboard = (props) => {
    const { setFeedback, loggedUser } = props;

    const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [] });
    const [showEvent, setShowEvent] = useState(false);
    const [targetEvent, setTargetEvent] = useState({});
    const [volunteeredTime, setVolunteeredTime] = useState(0);
    const [reloadDashboard, setReloadDashboard] = useState(false);
    // const [eventsList, setEventsList] = useState([]);
    // const [pastEvents, setPastEvents] = useState(0);


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
    }, [ reloadDashboard, loggedUser.v_id, setFeedback ]);

    //   useEffect(() => {
    //     const getEvents = async () => {
    //         try {
    //             const { data } = await axios.get(`/api/events/upcoming/volunteer/${props.loggedUser.v_id}?limit=3`);
    //             setEventsList(data.payload);
    //         } catch (err) {
    //             setFeedback(err)
    //         }
    //     }

    //     const getImportantEvents = async () => {
    //         try {
    //             const { data } = await axios.get(`/api/events/important?limit=3`);
    //             setImportantEvents(data.payload);

    //         } catch (err) {
    //             setFeedback(err)
    //         }
    //     }

    //     getEvents();
    //     getImportantEvents();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [reloadDashboard]);

    // useEffect(() => {
    //     const getAllVolunteeredTime = async () => {
    //         try {
    //             const { data } = await axios.get(`/api/time/hours/${props.loggedUser.v_id}`);
    //             setVolunteeredTime(data.payload.sum)

    //         } catch (err) {
    //             setFeedback(err)
    //         }
    //     }

    //     const getNumberOfPastEvents = async () => {
    //         try {
    //             const { data } = await axios.get(`/api/events/past/volunteer/${props.loggedUser.v_id}`);
    //             setPastEvents(data.payload.length)
    //         } catch (err) {
    //             setFeedback(err)
    //         }
    //     }

    //     getAllVolunteeredTime();
    //     getNumberOfPastEvents();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


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

          {/* {
              eventsList.map(event => <EventPreviewCard
                  key={event.event_id + event.event_start + event.event_end}
                  loggedUser={loggedUser}
                  event={event}
                  setShowEvent={setShowEvent}
                  targetEvent={targetEvent}
                  setTargetEvent={setTargetEvent}
              />)
          } */}
          {/* <br></br>
          <br></br>
          <h3>Important Pursuit Events</h3>
          {
              importantEvents.map(event => <EventPreviewCard
                  key={event.event_end + event.event_start + event.event_id}
                  loggedUser={loggedUser}
                  event={event}
                  setShowEvent={setShowEvent}
                  targetEvent={targetEvent}
                  setTargetEvent={setTargetEvent}
              />)
          } */}

        </div>
    )
}

export default Dashboard;