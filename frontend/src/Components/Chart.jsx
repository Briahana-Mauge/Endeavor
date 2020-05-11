/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function Chart (props) {
    const { xAxes , data, title, xText, color } = props;

    const chartData = {
        labels: xAxes,
        datasets: [
            {
                label: xText,
                data: data,
                backgroundColor: Array(12).fill(color),
                borderWidth: 2
            }
        ]
    };
    
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        fontColor: 'white',
                        beginAtZero: true
                    }
                }
            ],
            xAxes: [{
                ticks: {
                    fontColor: 'white',
                    beginAtZero: true
                }
            }]
        },
        title: {
            display: true,
            text: title,
            fontSize: 25,
            fontColor: 'white'
        },
        legend: {
            display: false,
            position: 'top',
            labels: {
                fontColor: 'white'
            }   
        },
        datalabels: {
            display: true,
            fontColor: 'white',
        }
    };


    return (
        <>
            <Bar data={chartData} options={options} />
        </>
    )
}