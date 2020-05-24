/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartsVolunteer Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';

import UIModule from '../UIModule';
import Chart from '../Chart';
import yearRange from '../../yearRangeFormatting';


export default function ChartsVolunteer (props) {
    const { chartData } = props;

    const [chartInterval, setChartInterval] = useState([]);
    const [chartVolunteerHours, setChartVolunteerHours] = useState([]);
    const [chartVolunteerEvents, setChartVolunteerEvents] = useState([]);

    useEffect(() => {
        const datesArr = yearRange();
        const hoursArr = [];
        const eventsArr = [];
    
        for (let date of datesArr) {
          let h = null;
          let e = null
    
          for (let data of chartData) {
            if (data.date === date) {
              h = data.hours;
              e = data.events_count;
            }
          }
          hoursArr.push(h);
          eventsArr.push(e);
        }
    
        setChartInterval(datesArr);
        setChartVolunteerEvents(eventsArr);
        setChartVolunteerHours(hoursArr);
    }, [chartData]);


    return (
        <>
          <UIModule className='dataModule' titleColor='My Volunteering Hours' titleRegular='This Year'>
            <Chart
              xAxes={chartInterval}
              data={chartVolunteerHours} 
              title={''}
              xText={'Months'}
              yText = {'Hours Earned'}
              color={'#2631bd'}
            />
          </UIModule>
          <UIModule className='dataModule' titleColor='My Events' titleRegular='This Year'>
            <Chart
              xAxes={chartInterval}
              data={chartVolunteerEvents} 
              title={''}
              xText={'Months'}
              yText={'Events Volunteered'}
              color={'rgba(155, 49, 117, 1)'}
            />
          </UIModule>
        </>
    )
}