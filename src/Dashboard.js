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


export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.gameWorker = new GameWorker();
    }

    componentWillUnmount() {
        console.log("unmount")
    }

    render() {
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


                    {[0].map((value) => (
                        <Grid key={value} item>
                            <Paper>
                                <ChartWrapper />
                            </Paper>
                        </Grid>
                    ))}
                    <Grid item>

                        <R0Slider />
                    </Grid>
                </Grid>
            </Container >
        );
    }
}  