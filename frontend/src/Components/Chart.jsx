/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
DashboardVolunteers Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function Chart (props) {
    const { xAxes , data, title, xText, color, yText } = props;

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
                        fontColor: 'white'
                      },
                    ticks: {
                        fontColor: 'white',
                        beginAtZero: true
                    },
                    gridLines:{
                        color:'grey'
                    }
                }
            ],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: xText,
                    fontColor: 'white'
                  },
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