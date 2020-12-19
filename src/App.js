import './App.css';
import Dashboard from './Dashboard';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';

import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ChartWrapper from "./ChartWrapper";
import DashboardConfig from "./DashboardConfig"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { dbGetScores } from "./dbUtils"


function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function HideAppBar(props) {
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Covid Simulator</Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </React.Fragment>
  );
}


function App() {
  const [page, setPage] = useState("index");

  const [ParetoCfg, setParetoCfg] = useState(DashboardConfig.pareto_cfg);

  useEffect(() => {

    dbGetScores(dataset => {
      var cfg = { ...ParetoCfg };
      cfg.data.datasets[1].data = dataset;
      setParetoCfg(cfg);
    });
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        {page === "index" && <>
          <Container maxWidth="sm">
            <Grid container
              justify="flex-start"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}><Paper variant="outlined"><ChartWrapper
                config={ParetoCfg}
                width={100} height={50} /></Paper></Grid>
              <Grid item xs={12}>
                <Button onClick={() => setPage("play")}>Start simulation</Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={() => setPage("about")}>About</Button>

              </Grid>
            </Grid>
          </Container>
        </>}
        {page === "play" && <Dashboard setParetoCfg={setParetoCfg} ParetoCfg={ParetoCfg} />}
      </header>
    </div>
  );
}

export default App;
