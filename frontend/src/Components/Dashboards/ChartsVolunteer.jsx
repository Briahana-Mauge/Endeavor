/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartsVolunteer Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';

import UIModule from '../UIModule';
import Chart from '../Chart';

export default function ChartsVolunteer (props) {
    const { chartData } = props;

    const [chartInterval, setChartInterval] = useState([]);
    const [chartVolunteerHours, setChartVolunteerHours] = useState([]);
    const [chartVolunteerEvents, setChartVolunteerEvents] = useState([]);

    useEffect(() => {
        let month = new Date().getMonth() + 2 ;
        let year = new Date().getFullYear() - 1;
        const datesArr = [];
        const hoursArr = [];
        const eventsArr = [];
    
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
              date =  '0' + (month - 12) + '-' + (year + 1);
            } else {
              date = (month - 12) + '-' + (year + 1);
            }
            month += 1;
          }
          datesArr.push(date);
        }
    
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
          <UIModule className='dataModule' titleColor='My Volunteer Hours' titleRegular='This Year'>
            <Chart
              xAxes={chartInterval}
              data={chartVolunteerHours} 
              title={''}
              xText={'Months'}
              yText = {'Number of Hours'}
              color={'#2631bd'}
            />
          </UIModule>
          <UIModule className='dataModule' titleColor='My Events' titleRegular='This Year'>
            <Chart
              xAxes={chartInterval}
              data={chartVolunteerEvents} 
              title={''}
              xText={'Months'}
              yText={'Number of Events'}
              color={'rgba(155, 49, 117, 1)'}
            />
          </UIModule>
        </>
    )
}