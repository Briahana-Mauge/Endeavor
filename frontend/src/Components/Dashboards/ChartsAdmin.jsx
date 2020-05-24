/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartsAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';

import UIModule from '../UIModule';
import Chart from '../Chart';
import yearRange from '../../yearRangeFormatting';


export default function ChartsAdmin(props) {
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
    <div className="row px-3">
      <div className="col-12 col-md-4 px-0">
        <UIModule className='dataModule' titleColor='New Volunteers' titleRegular='By Month'>
          <Chart
            xAxes={chartInterval}
            data={chartTotalVolunteerSignup}
            title={''}
            xText={'Months'}
            yText={'New Volunteers'}
            color={'rgba(52, 5, 191, 1)'}
          />
        </UIModule>
      </div>
      <div className="col-12 col-md-4 px-0">
        <UIModule className='dataModule' titleColor='Earned Volunteering Hours' titleRegular='By Month'>
          <Chart
            xAxes={chartInterval}
            data={chartTotalVolunteerHours}
            title={''}
            xText={'Months'}
            yText={'Hours Earned'}
            color={'rgba(255, 99, 132, 1)'}
          />
        </UIModule>
      </div>
      <div className="col-12 col-md-4 px-0">
        <UIModule className='dataModule' titleColor='Number of Events' titleRegular='By Month'>
          <Chart
            xAxes={chartInterval}
            data={chartTotalEvents}
            title={''}
            xText={'Months'}
            yText={'Events'}
            color={'rgba(155, 49, 117, 1)'}
          />
        </UIModule>
      </div>
    </div>
  );
}
