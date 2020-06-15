/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NewVolunteersDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import UIModule from '../../UIModule';
import VolunteerPreviewCard from './VolunteerPreviewCard';


const NewVolunteersDash = (props) => {
  const { newVolunteers, reloadDashboard, setReloadDashboard, setFeedback } = props;

  const [ volunteerIndex, setVolunteerIndex ] = useState(0);
  const [ slideIndicators, setSlideIndicators ] = useState([]);
  const [ slides, setSlides ] = useState([]);

  useEffect(() => {
    const slideIndicator = [];
    const slidesList = newVolunteers.map(( volunteer, index ) => {
        const { v_first_name, v_last_name, v_id } = volunteer;
  
        const volunteersInitials = v_first_name.slice(0, 1) + v_last_name.slice(0, 1);
        slideIndicator.push(index === volunteerIndex
          ? <li
              data-target="#newVolunteersSlideshow"
              data-slide-to={`${index}`}
              className="active"
              key={'newVolIndicator' + index}
              onClick={e => setVolunteerIndex(index)}
            >
              <div>{volunteersInitials}</div>
            </li>
          : <li
              data-target="#newVolunteersSlideshow"
              data-slide-to={`${index}`}
              key={'newVolIndicator' + index}
              onClick={e => setVolunteerIndex(index)}
            >
              <div>{volunteersInitials}</div>
            </li>
        );
        return(
          <div
            className={index === volunteerIndex ? "carousel-item active" : "carousel-item"}
            key={v_first_name + v_last_name + v_id}
          >
            <VolunteerPreviewCard volunteer={volunteer} acceptVolunteer={acceptVolunteer} dismissVolunteer={nextVolunteer}/>
          </div>
        );
    });

    setSlideIndicators(slideIndicator);
    setSlides(slidesList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVolunteers, reloadDashboard, volunteerIndex]);

  
  const acceptVolunteer = async (id) => {
    try {
        await axios.patch(`/api/volunteers/confirm/${id}`);
        if (volunteerIndex === newVolunteers.length - 1) {
          setVolunteerIndex(0)
        }
        setReloadDashboard(!reloadDashboard);
    } catch (err) {
        setFeedback(err)
    }
  }

  const previousVolunteer = () => {
    const newIndex = volunteerIndex - 1 >= 0 ? volunteerIndex - 1 : newVolunteers.length - 1;
    setVolunteerIndex(newIndex);
  }

  const nextVolunteer = () => {
    const newIndex = volunteerIndex + 1 >= newVolunteers.length ? 0 : volunteerIndex + 1;
    setVolunteerIndex(newIndex);
  }


  return (
    <UIModule className='deepSangria g1NVDash' titleColor="New Volunteer" titleRegular='Signups'>
        {newVolunteers.length <= 0
          ? (
              <div className='g1EmptyNewVolsMsg'>There are no new volunteers pending deliberation.</div>
            )
          : (
              <div id="newVolunteersSlideshow" className="g1NewVolCarousel carousel slide" data-ride="carousel" data-interval="false" data-touch="true">
                <ol className="carousel-indicators">
                  {slideIndicators}
                </ol>
                <div className="carousel-inner">
                  {slides}
                </div>
                <div className="g1CarouselArrows">
                  <div className="g1CarouselArrowsInterior col-lg-3 pl-0 pl-lg-3 ml-lg-2">
                    <div>
                      <a className="carousel-control-prev" href="#newVolunteersSlideshow" role="button" data-slide="prev" onClick={previousVolunteer}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                      </a>
                      <a className="carousel-control-next" href="#newVolunteersSlideshow" role="button" data-slide="next" onClick={nextVolunteer}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
        }

    </UIModule>
  );
}


export default NewVolunteersDash;
