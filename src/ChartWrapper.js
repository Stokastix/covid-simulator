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


    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    var date = new Date();

    var data4 = [{
        t: date.addDays(0),
        y: randomScalingFactor()
    }];

    useEffect(() => {
        var ctx = containerRef.current;
        var config = {
            type: 'line',
            data: {
                //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
                datasets: [{
                    label: 'Filled',
                    data: data4,
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
                        type: 'time',
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


        var animation = new Animate(1, params => {
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push({
                    t: date.addDays(params.frameId),
                    y: randomScalingFactor()
                });
            });
            myChart.update();
        })

        return animation.start().stop

    })


    return <canvas ref={containerRef} {...rest} width={100} height={50} />
}