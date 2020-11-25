import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import ChartWrapper from "./ChartWrapper";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import R0Slider from "./R0Slider";
import { useState } from 'react'

// eslint-disable-next-line import/no-webpack-loader-syntax
import GameWorker from 'worker-loader!./GameWorker.js';

import { useRef, useEffect } from 'react'
import Animate from "./Animate"

import DashboardViews from "./DashboardViews"

export default (props) => {
    const [death, setDeath] = useState(0);
    const [gdp, setGDP] = useState(0);

    const [R0, setR0] = useState(3.);
    const [gameWorkerRef, setGameWorkerRef] = useState();
    const [progressRate, setProgressRate] = useState(0.);

    function appendData(old_cfg, set_cfg, p) {
        var cfg = { ...old_cfg };
        cfg.data.datasets[0].data.push(p);
        set_cfg(cfg);
    }

    const [IGraphCfg, setIGraphCfg] = useState(DashboardViews.infected_cfg);
    const [GDPGraphCfg, setGDPGraphCfg] = useState(DashboardViews.gdp_cfg);
    const [R0GraphCfg, setR0GraphCfg] = useState(DashboardViews.r0_cfg);

    useEffect(() => {
        let gameWorker = (new GameWorker());
        setGameWorkerRef(gameWorker);

        gameWorker.onmessage = (event) => {
            const t = event.data.t;
            const I = event.data.I;
            const GDP = event.data.GDP;
            const R0 = event.data.R0;
            setDeath(Math.floor(event.data.D));
            setProgressRate(100 * event.data.progress);
            setGDP(GDP);

            appendData(IGraphCfg, setIGraphCfg, { t: t, y: I });
            appendData(GDPGraphCfg, setGDPGraphCfg, { t: t, y: 100 * GDP });
            appendData(R0GraphCfg, setR0GraphCfg, { t: t, y: R0 });
        };

        var animation = new Animate(1, params => {
            gameWorker.postMessage('getdata');
        });

        return animation.start().stop
    }, []);


    useEffect(() => {
        if (gameWorkerRef) {
            gameWorkerRef.postMessage({ "R0": R0, "msg": "setR0" })
        }
    }, [R0]);

    return (
        <Container maxWidth="sm">
            <Grid container direction="column"
                justify="flex-start"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}
                        alignItems="stretch">
                        <Grid item>
                            <Paper>
                                GDP: {Math.round(100 * gdp, 2)}%
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper>
                                Death Toll: {death}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Paper>
                        <LinearProgress variant="determinate" value={progressRate} />
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        <ChartWrapper config={IGraphCfg} width={100} height={50} />
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        <ChartWrapper config={GDPGraphCfg} width={100} height={50} />
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper>
                        <ChartWrapper config={R0GraphCfg} width={100} height={30} />
                    </Paper>
                </Grid>
                <Grid item>
                    <R0Slider setR0={setR0} />
                </Grid>
            </Grid>
        </Container >
    );
}  