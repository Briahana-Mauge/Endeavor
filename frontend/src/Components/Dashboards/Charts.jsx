/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */
import React, { useState, useEffect } from 'react';
import Chart from '../Chart';

export default function Charts (props) {
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
              date = year + '-0' + month;
            } else {
              date = year + '-' + month;
            }
            month += 1;
          } else {
            if (month < 22) {
              date = (year + 1) + '-0' + (month - 12);
            } else {
              date = (year + 1) + '-' + (month - 12);
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
            <Chart xAxes={chartInterval} data={chartVolunteerHours} 
                title={"Events I've Participated in for a Year"} xText={"Hours"} color={'rgba(255, 99, 132, 1)'}/>
            <Chart xAxes={chartInterval} data={chartVolunteerEvents} 
                title={"Events I've Participated in for a Year"} xText={"Events"} color={'rgba(155, 49, 117, 1)'}/>
        </>
    )
}