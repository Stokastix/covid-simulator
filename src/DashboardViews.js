function makeConfig(name, ylabel) {
    return {
        type: 'line',
        data: {
            datasets: [{
                label: 'Filled',
                data: [],
                fill: true,
                pointRadius: []
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

var hospital_cfg = makeConfig("Hospital Capacity", "%");
hospital_cfg.options.scales.yAxes[0].ticks = {
    min: 0,
    max: 200.
}



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

var pareto_cfg = {
    type: 'scatter',
    data: {
        datasets: [{
            borderColor: "#b30000",
            backgroundColor: "#ff3333",
            data: [{ x: 1., y: 0. }]
        },
        {
            data: [{ x: 50000., y: -8. }]
        }
        ]
    },
    options: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: "Pareto"
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: "Death"
                },
                ticks: {
                    min: 1,
                    max: 10000000,
                    stepSize: 10,
                    autoSkip: false,

                    callback: function (value, index, values) {
                        if (value === 10000000) return "10M";
                        if (value === 1000000) return "1M";
                        if (value === 100000) return "100K";
                        if (value === 10000) return "10K";
                        if (value === 1000) return "1K";
                        if (value === 100) return "100";
                        if (value === 10) return "10";
                        if (value === 0) return "0";
                        return null;
                    }
                },
                type: 'logarithmic'
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: "GDP"
                },
                ticks: {
                    min: -20,
                    max: 0.
                }
            }]
        }
    }
};

export default {
    "hospital_cfg": hospital_cfg,
    "infected_cfg": infected_cfg,
    "gdp_cfg": gdp_cfg,
    "r0_cfg": r0_cfg,
    "pareto_cfg": pareto_cfg
}
