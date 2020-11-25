import React, { useState, useRef, useEffect } from 'react'

import Chart from 'chart.js'

export default props => {
    const containerRef = useRef(null)

    const { config, ...rest } = props

    const [chart, setChart] = useState();

    useEffect(() => {
        if (chart) {
            chart.update({
                duration: 500,
                lazy: true,
                //easing: 'easeInOutSine'
            });
        }
    }, [config]);

    useEffect(() => {
        var ctx = containerRef.current;
        setChart(new Chart(ctx, config));
    }, [])

    return <canvas ref={containerRef} {...rest} />
}