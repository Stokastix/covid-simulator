function makeConfig(name, ylabel) {
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
                        labelString: ylabel
                    }
                }]
            }
        }
    };
}

var infected_cfg = makeConfig("Infected", "cases");
infected_cfg.options.scales.yAxes[0].ticks = {
    callback: function (value, index, values) {
        if (value >= 1e6) {
            return value / 1e6 + 'M';
        } else if (value >= 1e3) {
            return value / 1e3 + 'K';
        }
        return value
    },
    min: 0.
}
infected_cfg.data.datasets[0].lineTension = 0;

var gdp_cfg = makeConfig("GDP", "%");
gdp_cfg.options.scales.yAxes[0].ticks = {
    min: -20,
    max: 0.
}

var r0_cfg = makeConfig("R0", "ratio");
r0_cfg.options.scales.yAxes[0].ticks = {
    min: 0,
    max: 4
}

export default {
    "infected_cfg": infected_cfg,
    "gdp_cfg": gdp_cfg,
    "r0_cfg": r0_cfg,
}
