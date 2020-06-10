/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartsVolunteer Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';

import UIModule from '../UIModule';
import ChartBar from '../ChartBar';
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
          <div className="col-12 col-md-6">
            <UIModule className='dataModule' titleColor='My Volunteering Hours' titleRegular='This Year'>
              <ChartBar
                xAxes={chartInterval}
                data={chartVolunteerHours}
                title={''}
                xText={'12 Month History'}
                yText = {'Hours Earned'}
                color={'#8b8557'}
              />
            </UIModule>
          </div>
          <div className="col-12 col-md-6">
            <UIModule className='dataModule' titleColor='My Events' titleRegular='This Year'>
              <ChartBar
                xAxes={chartInterval}
                data={chartVolunteerEvents}
                title={''}
                xText={'12 Month History'}
                yText={'Events Volunteered'}
                color={'#a54a8b'}
              />
            </UIModule>
          </div>
        </>
    )
}