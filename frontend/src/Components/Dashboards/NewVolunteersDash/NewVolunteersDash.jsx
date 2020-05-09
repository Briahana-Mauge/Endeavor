/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
NewVolunteersDash Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React from 'react';
import axios from 'axios';

import VolunteerPreviewCard from './VolunteerPreviewCard';


const NewVolunteersDash = (props) => {
  const { newVolunteers, reloadDashboard, setReloadDashboard, setFeedback } = props;


  const acceptVolunteer = async (id) => {
    try {
        await axios.patch(`/api/volunteers/confirm/${id}`);
        setReloadDashboard(!reloadDashboard);
    } catch (err) {
        setFeedback(err)
    }
  }


  const slideIndicators = [];
  const slides = newVolunteers.map(( volunteer, index ) => {
      const { v_first_name, v_last_name, v_id } = volunteer;

      const volunteersInitials = v_first_name.slice(0, 1) + v_last_name.slice(0, 1);
      slideIndicators.push(index === 0
        ? <li
            data-target="#newVolunteersSlideshow"
            data-slide-to={`${index}`}
            className="active"
            key={'newVolIndicator' + index}
          >
            <div>{volunteersInitials}</div>
          </li>
        : <li
            data-target="#newVolunteersSlideshow"
            data-slide-to={`${index}`}
            key={'newVolIndicator' + index}
          >
            <div>{volunteersInitials}</div>
          </li>
      );
      return(
        <div
          className={index === 0 ? "carousel-item active" : "carousel-item"}
          key={v_first_name + v_last_name + v_id}
        >
          <VolunteerPreviewCard volunteer={volunteer} acceptVolunteer={acceptVolunteer}/>
        </div>
      );
  });

  const xPadding = "px-2";


  return (
    <div className="g1Card card mb-2">
      <h3 className={`g1CardHeader card-header ${xPadding} pb-4`}><span>New Volunteer</span> Signups</h3>
      <div className={`g1CardBody card-body pt-0 pb-1 ${xPadding}`}>

        {newVolunteers.length <= 0
          ? (
              <div>There are no new volunteers awaiting confirmation.</div>
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
              </div>
            )
        }

      </div>
    </div>
  );
}


export default NewVolunteersDash;
