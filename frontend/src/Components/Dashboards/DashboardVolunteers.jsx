/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerEDash from './EventsDash/VolunteerEDash';
import EventCard from '../EventCard';
import ImageFill from '../ImageFill';
import ChartsVolunteer from './ChartsVolunteer';
import { PrimaryModalContainer } from '../Modals/PrimaryModal';


const DashboardVolunteers = (props) => {
  const { setFeedback, loggedUser } = props;

  const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [], pastData: [] });
  const [showEvent, setShowEvent] = useState(false);
  const [targetEvent, setTargetEvent] = useState({});
  const [reloadDashboard, setReloadDashboard] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getEventsData = () => {
      axios.get(`/api/events/dashboard/volunteer`)
        .then(response => {
          if (isMounted) {
            setEventsObj(response.data.payload);
          }
        })
        .catch(err => {
          if (isMounted) {
            setFeedback(err)
          }
        });
    }
    getEventsData();

    //Cleanup
    return () => isMounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadDashboard, loggedUser.v_id]);


  const hideEvent = () => {
    setTargetEvent({});
    setShowEvent(false);
  }


  // Package drilled props
  const eventsDashProps = {
    loggedUser,
    setShowEvent,
    targetEvent,
    setTargetEvent
  }


  return (
    <>

      <div className="row">
        <div className="col-12 col-md-7">
          <VolunteerEDash events={eventsObj} {...eventsDashProps} />
        </div>
        <div className="d-none d-md-block col-md-5">
          <ImageFill />
        </div>
      </div>
      <div className="row">
        <ChartsVolunteer chartData={eventsObj.pastData} />
      </div>
      <div className="row">
        <div className="col-12 d-md-none">
          <ImageFill />
        </div>
      </div>

      <PrimaryModalContainer header={targetEvent.topic} runOnModalClose={hideEvent}>
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
      </PrimaryModalContainer>

    </>
    // {
    //   showEvent
    //     ? <EventRender
    //       loggedUser={loggedUser}
    //       event={targetEvent}
    //       setFeedback={setFeedback}
    //       reloadParent={reloadDashboard}
    //       setReloadParent={setReloadDashboard}
    //       hideEvent={hideEvent}
    //     />
    //     : null
    // }
  )
}


export default DashboardVolunteers;
