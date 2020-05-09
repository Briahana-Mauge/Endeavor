/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EventsDashAdmin from './EventsDash/EventsDashAdmin';
import NewVolunteersDash from './NewVolunteersDash/NewVolunteersDash';
import { PrimaryModalContainer } from '../Modals/PrimaryModal';
import EventCard from '../EventCard';


const DashboardAdmin = (props) => {
    const { setFeedback, loggedUser } = props;

    const [ newVolunteers, setNewVolunteers ] = useState([]);
    const [ eventsObj, setEventsObj ] = useState({ todays: [], importants: [], upcomings: [] });
    const [ showEvent, setShowEvent ] = useState(false);
    const [ targetEvent, setTargetEvent ] = useState({});
    const [ reloadDashboard, setReloadDashboard ] = useState(false);

    useEffect(() => {
        const getNewVolunteers = () => {
          axios.get('/api/volunteers/new')
            .then(res => setNewVolunteers(res.data.payload))
            .catch(err => setFeedback(err));
        }
        const getEvents = () => {
          axios.get('/api/events/dashboard/admin')
            .then(res => setEventsObj(res.data.payload))
            .catch(err => setFeedback(err));
        }

        getNewVolunteers();
        getEvents();
    }, [ reloadDashboard, setFeedback ]);


    const hideEvent = () => {
        setTargetEvent({});
        setShowEvent(false);
    };


    // PRE-RETURN (package drilled props)
    const eventsDashProps = {
      loggedUser,
      setShowEvent,
      targetEvent,
      setTargetEvent
    };
    const newVolunteersProps = {
      reloadDashboard,
      setReloadDashboard,
      setFeedback
    };


    return (
        <>

          <div className="row">
            <div className="col-12 col-md-5 pr-md-2">
              <EventsDashAdmin events={eventsObj} {...eventsDashProps} />
            </div>

            <div className="col-12 col-md-7 pl-md-2">
              <NewVolunteersDash newVolunteers={newVolunteers} {...newVolunteersProps} />
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
    );
}


export default DashboardAdmin;
