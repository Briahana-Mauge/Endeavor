/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartLine Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React from 'react';
import { Line } from 'react-chartjs-2';


export default function ChartLine (props) {
    const { xAxes, data, xText, color, yText } = props;

    // For the sake of time, this component will only be used once so the data will be manipulated here.
    // In the future, the data needs to be prepared before reaching this component, and possibly a loop implemented here

    // SETTINGS FOR ALL LINE CHARTS
    const labelsFont = "'Cabin', sans-serif";
    const labelsSize = 16;
    const labelsColor = '#8c8d8c';
    const ticksFont = "'Cabin'";
    const ticksColor = '#606060';

    const chartData = {
        labels: xAxes,
        type: 'line',
        datasets: [
            {
                // volunteered hours
                label: "Volunteered Hours",
                data: data[0],
                backgroundColor: Array(12).fill(color),
                borderWidth: 2,
                lineTension: .1,
                borderColor: '#11862a',
                pointRadius: 1,
                fill: false
            },
            {
                // number of events
                label: "Events Held",
                data: data[1],
                backgroundColor: Array(12).fill(color),
                borderWidth: 2,
                lineTension: .1,
                borderColor: '#1831ab',
                pointRadius: 1,
                fill: false
            },
        ]
    };

    const options = {
        scales: {
            yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yText,
                        fontFamily: labelsFont,
                        fontSize: labelsSize,
                        fontColor: labelsColor
                    },
                    ticks: {
                        fontFamily: ticksFont,
                        fontColor: ticksColor,
                        beginAtZero: true
                    },
                    gridLines:{
                        color: '#111'
                    }
            }],
            xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xText,
                        fontFamily: labelsFont,
                        fontSize: labelsSize,
                        fontColor: labelsColor
                    },
                    ticks: {
                        fontFamily: ticksFont,
                        fontSize: 10,
                        fontColor: ticksColor,
                        beginAtZero: true
                    },
                    gridLines:{
                        color: '#111'
                    }
            }]
        },
        // title: {
        //     display: true,
        //     text: title,
        //     fontSize: 1,
        //     fontColor: '#9c9c9c'
        // },
        legend: {
            display: true,
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
        <Line data={chartData} options={options} />
    );
}