/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartsAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';

import UIModule from '../UIModule';
import Chart from '../Chart';

export default function ChartsAdmin(props) {
  const { chartData } = props;
  const [chartInterval, setChartInterval] = useState([]);
  const [chartTotalVolunteerHours, setChartTotalVolunteerHours] = useState([]);
  const [chartTotalEvents, setChartTotalEvents] = useState([]);
  const [chartTotalVolunteerSignup, setChartTotalVolunteerSignup] = useState([]);

  useEffect(() => {
    if (chartData !== undefined) {
      let month = new Date().getMonth() + 2;
      let year = new Date().getFullYear() - 1;
      const datesArr = [];
      const hoursArr = [];
      const eventsArr = [];
      const volunteersArr = [];

      for (let i = 0; i < 12; i++) {
        let date = '';
        if (month <= 12) {
          if (month < 10) {
            date = '0' + month + '-' + year;
          } else {
            date = month + '-' + year;
          }
          month += 1;
        } else {
          if (month < 22) {
            date = '0' + (month - 12) + '-' + (year + 1);
          } else {
            date = (month - 12) + '-' + (year + 1);
          }
          month += 1;
        }
        datesArr.push(date);
      }

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
      <UIModule className='dataModule' titleColor='New Volunteers' titleRegular='By Month'>
        <Chart
          xAxes={chartInterval}
          data={chartTotalVolunteerSignup}
          // title={'New Volunteer Signups for a Year'}
          xText={'Months'}
          yText={'Number of Volunteers'}
          color={'rgba(0, 210, 0, 1)'}
        />
      </UIModule>
      <UIModule className='dataModule' titleColor='Earned Volunteering Hours' titleRegular='By Month'>
        <Chart
          xAxes={chartInterval}
          data={chartTotalVolunteerHours}
          // title={'Total Volunteer Hours in for a Year'}
          xText={'Months'}
          yText={'Number of Hours'}
          color={'rgba(255, 99, 132, 1)'}
        />
      </UIModule>
      <UIModule className='dataModule' titleColor='Number of Events' titleRegular='By Month'>
        <Chart
          xAxes={chartInterval}
          data={chartTotalEvents}
          // title={'Total Events Held in for a Year'}
          xText={'Months'}
          yText={'Number of Events'}
          color={'rgba(155, 49, 117, 1)'}
        />
      </UIModule>
    </>
  )
}
