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
    let gameWorker
    const [data, setData] = useState([]);

    useEffect(() => {
        gameWorker = new GameWorker();
        var date = new Date();

        gameWorker.onmessage = (event) => {
            const t = event.data.t;
            const y = event.data.I;

            setData(oldData => [...oldData, {
                t: t,
                y: y
            }]);
        };

        var animation = new Animate(1, params => {
            gameWorker.postMessage('getdata');
        });

        return animation.start().stop
    }, []);

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
                                GDP: -10%
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper>
                                Death Toll: 57K
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item>
                    <Paper>
                        <ChartWrapper data={data} />
                    </Paper>
                </Grid>
                <Grid item>

                    <R0Slider />
                </Grid>
            </Grid>
        </Container >
    );
}  