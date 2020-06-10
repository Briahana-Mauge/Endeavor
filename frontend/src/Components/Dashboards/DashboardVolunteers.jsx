/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerEDash from './EventsDash/VolunteerEDash';
import ImageFill from '../ImageFill';
import ChartsVolunteer from './ChartsVolunteer';


const DashboardVolunteers = (props) => {
  const { setFeedback, loggedUser } = props;

  const [eventsObj, setEventsObj] = useState({ upcomings: [], pasts: [], importants: [], pastData: [] });

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
  }, [loggedUser.v_id]);


  return (
    <>

      <div className="row">
        <div className="col-12 col-md-7">
          <VolunteerEDash events={eventsObj} />
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

    </>
  )
}


export default DashboardVolunteers;
