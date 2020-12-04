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

import EuroIcon from '@material-ui/icons/Euro';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';

import R0Slider from "./R0Slider";
import { useState } from 'react'

// eslint-disable-next-line import/no-webpack-loader-syntax
import GameWorker from 'worker-loader!./GameWorker.js';

import { useRef, useEffect } from 'react'
import Animate from "./Animate"

import DashboardConfig from "./DashboardConfig"
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { useTheme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
});

export default function (props) {


    const classes = useStyles();
    const theme = useTheme();

    const { charts, active } = props;

    const [activeStep, setActiveStep] = React.useState(active);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Paper variant="outlined">
            <MobileStepper
                variant="dots"
                steps={charts.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === charts.length - 1}>
                        Next
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Back
                    </Button>
                }
            />
            {charts.map((chart, idx) => (activeStep === idx && chart))}
        </Paper>
    );
}