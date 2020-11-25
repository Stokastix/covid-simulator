import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
    },
    margin: {
        height: theme.spacing(3),
    },

    control: {
        padding: theme.spacing(2),
    },
}));

const marks = [
    {
        value: 0.1,
        label: '0.1',
    },
    {
        value: 1.,
        label: '1.0',
    },
    {
        value: 2.,
        label: '2.0',
    },
    {
        value: 3.0,
        label: '3.0',
    },
];

function valuetext(value) {
    return `R0=${value}`;
}


export default (props) => {
    const classes = useStyles();

    const { setR0, ...rest } = props

    const handleSliderChange = (event, newValue) => {
        setR0(newValue);
    };

    return (
        <Paper>
            <div>
                <Typography id="discrete-slider-always" gutterBottom>
                    R0
            </Typography>
                <Slider
                    min={0.1}
                    max={3.}
                    defaultValue={3.}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-always"
                    step={0.1}
                    marks={marks}
                    onChange={handleSliderChange}
                    valueLabelDisplay="on"
                />
            </div>
        </Paper>
    );
}
