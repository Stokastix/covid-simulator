import React, { useRef, useEffect } from 'react'

import Chart from 'chart.js'
import Animate from "./Animate"

function randomScalingFactor() {
    return Math.random();
};


export default props => {
    const containerRef = useRef(null)

    const { ...rest } = props

    var data1 = [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
    ];

    var data2 = [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
    ];

    var data3 = [
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor(),
        randomScalingFactor()
    ];

    useEffect(() => {
        var ctx = containerRef.current;
        var config = {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                datasets: [{
                    label: 'Unfilled',
                    fill: false,
                    data: data1,
                }, {
                    label: 'Dashed',
                    fill: false,
                    borderDash: [5, 5],
                    data: data2,
                }, {
                    label: 'Filled',
                    data: data3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'R0'
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };
        var myChart = new Chart(ctx, config);


        var animation = new Animate(1, (time, frameId) => {
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(1.);
            });
            myChart.update();
        })

        return animation.start().stop

    })


    return <canvas ref={containerRef} {...rest} width={100} height={50} />
}