/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import Chart from '../Chart';

import yearRange from '../../yearRangeFormatting';


export default function Charts(props) {
  const { chartData } = props;
  const [chartInterval, setChartInterval] = useState([]);
  const [chartTotalVolunteerHours, setChartTotalVolunteerHours] = useState([]);
  const [chartTotalEvents, setChartTotalEvents] = useState([]);
  const [chartTotalVolunteerSignup, setChartTotalVolunteerSignup] = useState([]);

  useEffect(() => {
    if (chartData !== undefined) {
      const datesArr = yearRange();
      const hoursArr = [];
      const eventsArr = [];
      const volunteersArr = [];

      for (let date of datesArr) {
        let h = null;
        let e = null;
        let v = null;

          for (let data of chartData[0].hours) {
            if (data.date === date) {
              h = data.hours;
            }
          }

          for (let data of chartData[0].events) {
            if (data.date === date) {
              e = data.count;
            }
          }

          for (let data of chartData[0].volunteers) {
            if (data.date === date) {
              v = data.volunteers;
            }
          }

        hoursArr.push(h);
        eventsArr.push(e);
        volunteersArr.push(v)
      }

      setChartInterval(datesArr);
      setChartTotalEvents(eventsArr);
      setChartTotalVolunteerHours(hoursArr);
      setChartTotalVolunteerSignup(volunteersArr)
    }
  }, [chartData]);


  return (
    <>
      <Chart xAxes={chartInterval} data={chartTotalVolunteerSignup}
        title={"New Volunteer Signups for a Year"} xText={"Months"} yText={'Number of Volunteers'} color={'rgba(0, 210, 0, 1)'} />
      <br></br>
      <Chart xAxes={chartInterval} data={chartTotalVolunteerHours}
        title={"Total Volunteer Hours in for a Year"} xText={"Months"} yText={'Number of Hours'} color={'rgba(255, 99, 132, 1)'} />
      <br></br>
      <Chart xAxes={chartInterval} data={chartTotalEvents}
        title={"Total Events Held in for a Year"} xText={"Months"} yText={'Number of Events'} color={'rgba(155, 49, 117, 1)'} />
    </>
  )
}
