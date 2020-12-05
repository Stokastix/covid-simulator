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

import LocalHospitalIcon from '@material-ui/icons/LocalHospitalOutlined';
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';
import EuroIcon from '@material-ui/icons/AccountBalanceOutlined';

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

import ChartSwitcher from "./ChartSwitcher"
import PlayArrowSharpIcon from '@material-ui/icons/PlayArrowSharp';
import { dbGetScores, dbUploadScore } from "./dbUtils"

import LinearProgressWithLabel from "./LinearProgressWithLabel";

import AlertDialogSlide from "./AlertDialogSlide"

const useStyles = makeStyles({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
    addGraph: {
        borderStyle: "dashed", height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }
});

function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export default (props) => {
    const [death, setDeath] = useState(0);
    const [infected, setInfected] = useState(0);
    const [gdp, setGDP] = useState(0);

    const [R0, setR0] = useState(3.);
    const gameWorkerRef = useRef(null);
    const [start, setStart] = useState(false);
    const [progressRate, setProgressRate] = useState(0.);

    const [IGraphCfg, setIGraphCfg] = useState(DashboardConfig.infected_cfg);
    const [GDPGraphCfg, setGDPGraphCfg] = useState(DashboardConfig.gdp_cfg);
    const [R0GraphCfg, setR0GraphCfg] = useState(DashboardConfig.r0_cfg);
    const [ParetoCfg, setParetoCfg] = useState(DashboardConfig.pareto_cfg);
    const [HospitalCfg, setHospitalCfg] = useState(DashboardConfig.hospital_cfg);
    const [DeathsGraphCfg, setDeathsGraphCfg] = useState(DashboardConfig.deaths_cfg);


    const [open, setOpen] = React.useState(false);
    const [quote, setQuote] = useState("click on Start Game when you are ready!");
    const [severity, setSeverity] = useState("info");

    const [chartList, setChartList] = useState([1]);


    function appendData(old_cfg, set_cfg, p) {
        var cfg = { ...old_cfg };
        cfg.data.datasets[0].data.push(p);
        cfg.data.datasets[0].pointRadius.push(2);
        const l = cfg.data.datasets[0].pointRadius.length;
        if (l >= 3) {
            cfg.data.datasets[0].pointRadius[l - 2] = 0;
        }

        set_cfg(cfg);
    }

    function updatePareto(old_cfg, set_cfg, p) {
        var cfg = { ...old_cfg };
        cfg.data.datasets[0].data[0] = p
        set_cfg(cfg);
    }

    const handleClose = (event, reason) => {
        /*if (reason === 'clickaway') {
            return
        }*/
        setOpen(false);
    };

    useEffect(() => {
        setOpen(true);

        dbGetScores(dataset => {
            var cfg = { ...ParetoCfg };
            cfg.data.datasets[1].data = dataset;
            setParetoCfg(cfg);
        });
    }, []);

    useEffect(() => {
        if (start) {
            let gameWorker = (new GameWorker());
            gameWorkerRef.current = gameWorker;

            gameWorker.onmessage = (event) => {
                if (event.data.type == "data") {
                    const t = event.data.t;
                    const I = event.data.I;
                    const GDP = event.data.GDP;
                    const R0 = event.data.R0;
                    const H = event.data.H;
                    setDeath(Math.floor(event.data.D));
                    setProgressRate(100 * event.data.progress);
                    setGDP(GDP);
                    setInfected(I);

                    appendData(IGraphCfg, setIGraphCfg, { t: t, y: I });
                    appendData(GDPGraphCfg, setGDPGraphCfg, { t: t, y: 100 * GDP });
                    appendData(R0GraphCfg, setR0GraphCfg, { t: t, y: R0 });
                    appendData(HospitalCfg, setHospitalCfg, { t: t, y: 100 * H });
                    appendData(DeathsGraphCfg, setDeathsGraphCfg, { t: t, y: Math.floor(event.data.D) });

                    updatePareto(ParetoCfg, setParetoCfg, { x: 1 + event.data.D, y: 100 * GDP });
                } else if (event.data.type == "quote") {
                    setQuote(event.data.quote);
                    setSeverity(event.data.severity)
                    setOpen(true);
                } else if (event.data.type == "gameFinished") {
                    setQuote("Congratulations for participating!");
                    setSeverity("success");
                    setOpen(true);
                    dbUploadScore(event.data.D, event.data.GDP);
                }
            };

            var animation = new Animate(1, params => {
                gameWorker.postMessage('getdata');
            });

            return animation.start().stop
        }
    }, [start]);

    useEffect(() => {
        if (gameWorkerRef.current) {
            gameWorkerRef.current.postMessage({ "R0": R0, "msg": "setR0" })
        }
    }, [R0]);


    const charts = [
        ParetoCfg, IGraphCfg, HospitalCfg, DeathsGraphCfg, GDPGraphCfg, R0GraphCfg
    ].map((cfg, idx) =>
        <ChartWrapper
            key={idx}
            config={cfg}
            width={100} height={50} />
    );

    const classes = useStyles();


    return (
        <Container maxWidth="md">
            <Grid container
                justify="flex-start"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}
                        alignItems="stretch">

                        <Grid item xs={4}>
                            <Paper variant="outlined" >
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                        <LocalHospitalIcon style={{ color: 'rgb(199,0,57)' }} />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            Infected
                                        </Typography>
                                        <Typography>{nFormatter(infected, 2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={4}>
                            <Paper variant="outlined" >
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                        <EuroIcon style={{ color: 'rgb(255,195,0)' }} />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            GDP
                                        </Typography>
                                        <Typography>{(100 * gdp).toFixed(2)}%</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={4}>
                            <Paper variant="outlined" >
                                <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                        <AirlineSeatFlatIcon style={{ color: 'rgb(0,0,0)' }} />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            Death
                                        </Typography>
                                        <Typography>{nFormatter(death, 2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                    </Grid>
                </Grid>

                <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}
                    anchorOrigin={{ vertical: "TOP", horizontal: "CENTER" }}
                >
                    <MuiAlert severity={severity} elevation={6} variant="filled" >
                        {quote}
                    </MuiAlert>
                </Snackbar>
                <AlertDialogSlide active={true} />

                <Grid item xs={12}>
                    <Paper variant="outlined">
                        <LinearProgressWithLabel value={progressRate} />
                    </Paper>
                </Grid>

                {chartList.map(
                    (active, idx) =>
                        <Grid key={idx} item xs={12} md={6}>
                            <ChartSwitcher charts={charts} active={active} />
                        </Grid>
                )}


                <Grid item xs={12} md={6}>
                    <Paper className={classes.addGraph}
                        variant="outlined"
                    >
                        <Button variant="outlined" color="primary" href="#outlined-buttons" onClick={
                            () => {
                                setChartList(prev => [...prev, 1]);
                            }
                        }
                            style={{ width: "50%", margin: "auto", border: "0px" }}
                        >
                            Add Graph
                    </Button>
                    </Paper>
                </Grid>

                {!start &&
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<PlayArrowSharpIcon />}
                            onClick={() => setStart(true)}
                        >
                            Start the pandemic
                    </Button>
                    </Grid>
                }{start &&
                    <Grid item xs={12}>
                        <R0Slider setR0={setR0} />
                    </Grid>
                }
            </Grid>
        </Container >
    );
}   