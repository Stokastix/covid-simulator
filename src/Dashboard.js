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
import R0Slider from "./R0Slider";
import { useState } from 'react'

// eslint-disable-next-line import/no-webpack-loader-syntax
import GameWorker from 'worker-loader!./GameWorker.js';

import { useRef, useEffect } from 'react'
import Animate from "./Animate"


export default (props) => {
    const [data, setData] = useState([]);
    const [data_GDP, setData_GDP] = useState([]);
    const [death, setDeath] = useState(0);
    const [gdp, setGDP] = useState(0);

    const [R0, setR0] = useState(3.);
    const [gameWorkerRef, setGameWorkerRef] = useState();


    useEffect(() => {
        let gameWorker = (new GameWorker());
        setGameWorkerRef(gameWorker);
        var date = new Date();

        console.log(">>>", gameWorker);

        gameWorker.onmessage = (event) => {
            const t = event.data.t;
            const I = event.data.I;
            const GDP = event.data.GDP;
            setDeath(Math.floor(event.data.D));
            setGDP(GDP);

            setData(oldData => [...oldData, {
                t: t,
                y: I
            }]);

            setData_GDP(oldData => [...oldData, {
                t: t,
                y: GDP
            }]);
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
                        <ChartWrapper data={data} name={"Infected"} />
                    </Paper>
                    <Paper>
                        <ChartWrapper data={data_GDP} name={"GDP"} />
                    </Paper>
                </Grid>
                <Grid item>

                    <R0Slider setR0={setR0} />
                </Grid>
            </Grid>
        </Container >
    );
}  