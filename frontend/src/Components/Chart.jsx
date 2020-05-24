/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function Chart (props) {
    const { xAxes, data, title, xText, color, yText } = props;

    const chartData = {
        labels: xAxes,
        datasets: [
            {
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
                    scaleLabel: {
                        display: true,
                        labelString: yText,
                        fontColor: '#9c9c9c'
                    },
                    ticks: {
                        fontColor: '#9c9c9c',
                        beginAtZero: true
                    },
                    gridLines:{
                        color: '#222'
                    }
                }
            ],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: xText,
                    fontColor: '#9c9c9c'
                },
                ticks: {
                    fontColor: '#9c9c9c',
                    beginAtZero: true
                }
            }]
        },
        title: {
            display: true,
            text: title,
            fontSize: 1,
            fontColor: '#9c9c9c'
        },
        legend: {
            display: false,
            position: 'top',
            labels: {
                fontColor: '#9c9c9c'
            }   
        },
        datalabels: {
            display: true,
            fontColor: '#9c9c9c',
        }
    };


    return(
        <Bar data={chartData} options={options} />
    );
}