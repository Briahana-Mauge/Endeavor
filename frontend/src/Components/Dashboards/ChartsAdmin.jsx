/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartsAdmin Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';

import UIModule from '../UIModule';
import ChartBar from '../ChartBar';
import ChartLine from '../ChartLine';
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
    <>
      <div className="row px-3">
        <div className="col-12 col-md-6 pl-0 pr-1">
          <UIModule className='dataModule' titleColor='New Confirmed Volunteers' titleRegular='By Month'>
            <ChartBar
              xAxes={chartInterval}
              data={chartTotalVolunteerSignup}
              title={''}
              xText={'12-Month History'}
              yText={'Volunteers'}
              color={'#3c5684'}
            />
          </UIModule>
        </div>
        <div className="col-12 col-md-6 pl-1 pr-0">
          <UIModule className='dataModule' titleColor='Volunteer Hours Served' titleRegular='By Month'>
            <ChartBar
              xAxes={chartInterval}
              data={chartTotalVolunteerHours}
              title={''}
              xText={'12-Month History'}
              yText={'Hours'}
              color={'#b7af7d'}
            />
          </UIModule>
        </div>
      </div>

      <div className="row px-3">
        <div className="col-12 col-md-6 pl-0 pr-1">
          <UIModule className='dataModule' titleColor='Events Held' titleRegular='By Month'>
            <ChartBar
              xAxes={chartInterval}
              data={chartTotalEvents}
              title={''}
              xText={'12-Month History'}
              yText={'Events'}
              color={'#ab69a2'}
            />
          </UIModule>
        </div>
        <div className="col-12 col-md-6 pl-1 pr-0">
          <UIModule className='dataModule' titleColor='Volunteered Hours & Events Held' titleRegular='Overlay'>
            <ChartLine
              xAxes={chartInterval}
              data={[ chartTotalVolunteerHours, chartTotalEvents ]}
              title={''}
              xText={'12-Month History'}
              yText={'Volunteers / Events'}
              color={'rgba(155, 49, 117, 1)'}
            />
          </UIModule>
        </div>
      </div>
    </>
  );
}
