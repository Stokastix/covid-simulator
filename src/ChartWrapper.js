import React, { useState, useRef, useEffect } from 'react'

import Chart from 'chart.js'

export default props => {
    const containerRef = useRef(null)

    const { config, ...rest } = props

    const chart = useRef(null);

    useEffect(() => {
        if (chart.current) {
            chart.current.update({
                duration: 500,
                lazy: true,
                //easing: 'easeInOutSine'
            });
        }
    }, [config]);

    useEffect(() => {
        var canvas = containerRef.current;
        chart.current = new Chart(canvas, config);
    }, [])

    return <canvas ref={containerRef} {...rest} />
}