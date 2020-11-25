function makeConfig(name) {
    return {
        type: 'line',
        data: {
            datasets: [{
                label: 'Filled',
                data: [],
                fill: true,
            }]
        },
        options: {
            legend: {
                display: false
            },
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
}

var gdp_cfg = makeConfig("GDP");
gdp_cfg.options.scales.yAxes[0].ticks = {
    min: -20,
    max: 0.
}

var r0_cfg = makeConfig("R0");
r0_cfg.options.scales.yAxes[0].ticks = {
    min: 0,
    max: 4
}

export default {
    "infected_cfg": makeConfig("Infected"),
    "gdp_cfg": gdp_cfg,
    "r0_cfg": r0_cfg,
}
