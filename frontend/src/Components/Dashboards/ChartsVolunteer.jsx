/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import Chart from '../Chart';

import yearRange from '../../yearRangeFormatting';

export default function Charts (props) {
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
            <Chart xAxes={chartInterval} data={chartVolunteerHours} 
                title={"Events I've Participated in for a Year"} xText={"Hours"} color={'rgba(255, 99, 132, 1)'}/>
            <Chart xAxes={chartInterval} data={chartVolunteerEvents} 
                title={"Events I've Participated in for a Year"} xText={"Events"} color={'rgba(155, 49, 117, 1)'}/>
        </>
    )
}