/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VolunteerPreviewCard from '../VolunteerPreviewCard';
import EventsDashAdmin from './EventsDash/EventsDashAdmin';
import EventCard from '../EventCard';


const DashboardAdmin = (props) => {
    const { setFeedback, loggedUser } = props;

    const [ newVolunteersList, setNewVolunteersList ] = useState([]);
    const [ eventsObj, setEventsObj ] = useState({ todays: [], importants: [], upcomings: [] });
    const [ showEvent, setShowEvent ] = useState(false);
    const [ targetEvent, setTargetEvent ] = useState({});
    const [ reloadDashboard, setReloadDashboard ] = useState(false);


    useEffect(() => {
        const getNewVolunteer = async () => {
          try {
              const {data} = await axios.get('/api/volunteers/new');
              setNewVolunteersList(data.payload);
          } catch (err) {
              setFeedback(err)
          }
        }

        const getEvents = async () => {
          try {
              const {data} = await axios.get('/api/events/dashboard/admin');
              setEventsObj(data.payload);
          } catch (err) {
              setFeedback(err)
          }
        }

        getNewVolunteer();
        getEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadDashboard]);


    const acceptVolunteer = async (id) => {
        try {
            await axios.patch(`/api/volunteers/confirm/${id}`);
            setReloadDashboard(!reloadDashboard);
        } catch (err) {
            setFeedback(err)
        }
    }

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


    const listNewVolCardPointers = [];
    const listNewVolCards = newVolunteersList.map(( volunteer, index ) => {
      console.log(index === 0)
        listNewVolCardPointers.push(index === 0
          ? <li data-target="#newVolunteersSlideshow" data-slide-to={`${index}`} className="active" key={index}></li>
          : <li data-target="#newVolunteersSlideshow" data-slide-to={`${index}`} key={index}></li>
        );
        return(
          <div className={index === 0 ? "carousel-item active" : "carousel-item"} key={volunteer.v_first_name+volunteer.v_last_name_volunteer_id}>
              <VolunteerPreviewCard volunteer={volunteer} acceptVolunteer={acceptVolunteer}/>
          </div>
        );
    });




    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-5">
              <EventsDashAdmin events={eventsObj} {...eventsDashProps} />
            </div>

            <div className="col-12 col-md-7">
              <div id="newVolunteersSlideshow" className="carousel slide" data-ride="carousel" data-interval="false">
                <ol className="carousel-indicators">
                  {listNewVolCardPointers}
                </ol>
                <div className="carousel-inner">
                  {listNewVolCards}
                </div>
                <a className="carousel-control-prev" href="#newVolunteersSlideshow" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#newVolunteersSlideshow" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>

        {/* <hr /> */}
        {/* <h3>Upcoming Events:</h3>
        <div className='d-flex flex-wrap'>
            {
                eventsObj.todays.map(event => <EventPreviewCard
                        key={event.event_id + event.event_end + event.event_start}
                        loggedUser={loggedUser}
                        event={event}
                        setShowEvent={setShowEvent}
                        targetEvent={targetEvent}
                        setTargetEvent={setTargetEvent}
                    />)
            }
        </div> */}

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

export default DashboardAdmin;
