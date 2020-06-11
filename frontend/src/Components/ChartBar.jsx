/*
ANIME BENSALEM, BRIAHANA MAUGÉ, JOSEPH P. PASAOA
ChartBar Component | Capstone App (Pursuit Volunteer Mgr)
*/


/* IMPORTS */

import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function ChartBar (props) {
    const { xAxes, data, xText, color, yText } = props;

    // SETTINGS FOR ALL BAR CHARTS
    const labelsFont = "'Cabin', sans-serif";
    const labelsSize = 16;
    const labelsColor = '#8c8d8c';
    const ticksFont = "'Cabin'";
    const ticksColor = '#606060';


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
        animation: {
            duration: 0 // general animation time
        },
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