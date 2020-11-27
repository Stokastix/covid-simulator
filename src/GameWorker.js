import nj from "numjs";


Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    var t = date.getTime();
    date.setTime(Math.floor(t + days * 24 * 60 * 60 * 1000));
    return date;
}

const date = new Date("2020-01-01");

const quotes = [
    { "date": new Date("2020-01-02"), "severity": "success", "quote": "L'épidémie vient de se déclarer, à vous de jouer!" },
    { "date": new Date("2020-02-02"), "severity": "info", "quote": "\"Il n'y aura quasiment pas de mort!\"" },
    { "date": new Date("2020-03-15"), "severity": "warning", "quote": "Le conseil scientifique conseille de confiner" },
    { "date": new Date("2020-06-15"), "severity": "info", "quote": "\"Il n'y aura pas de seconde vague\"" },
    { "date": new Date("2020-09-15"), "severity": "warning", "quote": "Le conseil scientifique conseille de reconfiner" },
    { "date": new Date("2020-11-15"), "severity": "success", "quote": "Les vaccins sont en production" },
]

function initWorker() {


    console.log("starting worker");
    const N = 70000000

    const hospital_limit_percentage = 0.0008

    const N_DAYS = 365
    const dt = 0.1
    const N_STEPS = Math.floor(N_DAYS / dt);

    const TIME_STEPS = nj.arange(0, N_STEPS)
    const TIME_SPACE = TIME_STEPS.multiply(dt)

    const hospital_ratio = 0.10
    const death_ratio = 0.018
    const death_ratio_overloaded = 0.03

    const gamma = 1 / (13.)
    const alpha = (r) => { return r + 20.; };

    var R0 = nj.ones(N_STEPS).multiply(3)

    var S = nj.ones(N_STEPS).multiply(N - 1)
    var I = nj.ones(N_STEPS)
    var R = nj.zeros(N_STEPS)
    var D = nj.zeros(N_STEPS)
    var GDP = nj.zeros(N_STEPS)

    var t = 1
    var qidx = 0;


    const GDP_baseline = TIME_SPACE.multiply(alpha(R0.get(0)));

    function gameLoop() {
        if (t < TIME_STEPS.get(-1)) {
            var beta = R0.get(t) * gamma
            const tmp1 = (beta / N) * I.get(t - 1) * S.get(t - 1)
            const tmp2 = gamma * I.get(t - 1)
            S.set(t, S.get(t - 1) - dt * tmp1)
            I.set(t, I.get(t - 1) + dt * (tmp1 - tmp2))
            var dr = death_ratio
            if (hospital_ratio * I.get(t - 1) > hospital_limit_percentage * N) {
                dr = death_ratio_overloaded
            }
            R.set(t, R.get(t - 1) + (1 - dr) * dt * tmp2)
            D.set(t, D.get(t - 1) + dr * dt * tmp2)

            GDP.set(t, GDP.get(t - 1) + dt * alpha(R0.get(t)) * ((S.get(t) + R.get(t)) / N))
            t += 1

            if (qidx < quotes.length && date.addDays(t * dt) < quotes[qidx].date && date.addDays((t + 1) * dt) >= quotes[qidx].date) {
                postMessage({ ...quotes[qidx], "type": "quote" });
                qidx += 1;
            }
        }
    }

    this.start = () => {
        console.log("start");
        setInterval(gameLoop, 1000 * dt); // one day is one second
    }

    this.get = () => {
        const t0 = Math.max(0, t - 1);
        return {
            "type": "data",
            "t": date.addDays(t0 * dt),
            "progress": t0 / TIME_STEPS.get(-1),
            "S": S.get(t0),
            "I": Math.floor(I.get(t0)),
            "R": R.get(t0),
            "R0": R0.get(t0),
            "D": D.get(t0),
            "H": I.get(t0) * hospital_ratio / (hospital_limit_percentage * N),
            "GDP": (GDP.get(t0) - GDP_baseline.get(t0)) / GDP_baseline.get(t0)
        };
    }

    this.setR0 = (v) => {
        for (var i = t; i < TIME_STEPS.get(-1); i++) {
            R0.set(i, v)
        }
    }
}


var worker = new initWorker();
worker.start();

onmessage = async ($event) => {
    if ($event) {
        if ($event.data === 'getdata') {
            postMessage(worker.get());
        } else if ($event.data.msg && $event.data.msg === 'setR0') {
            worker.setR0($event.data.R0);
        }
    }

};
