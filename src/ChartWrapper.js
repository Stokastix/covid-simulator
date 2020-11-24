import React, { useState, useRef, useEffect } from 'react'

import Chart from 'chart.js'
import Animate from "./Animate"


export default props => {
    const containerRef = useRef(null)

    const { name, data, ...rest } = props

    const [chart, setChart] = useState();

    var date = new Date();


    useEffect(() => {
        if (chart) {
            chart.data.datasets[0].data = data;
            chart.update();
        }
    }, [data]);

    useEffect(() => {
        var ctx = containerRef.current;
        var config = {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Filled',
                    data: [],
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: name
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

        setChart(myChart);

        /*
        var animation = new Animate(0.01, params => {
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push({
                    t: date.addDays(params.frameId),
                    y: Math.random()
                });
            });
            myChart.update();
        })

        return animation.start().stop
        */
    }, [])

    return <canvas ref={containerRef} {...rest} width={100} height={50} />
}