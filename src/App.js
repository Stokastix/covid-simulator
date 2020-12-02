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

import firebase from 'firebase/app';

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
  const [start, setStart] = useState(false);

  const testDb = () => {
    const db = firebase.firestore();

    // Write on db a random document
    db.collection('logs')
      .add({
        death: Math.floor(Math.random() * 1000000),
        gdp: -Math.floor(Math.random() * 12),
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);

        // Get all the documents from the collection
        db.collection('logs')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, ' => ', doc.data());
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        {!start && <Button onClick={() => setStart(true)}>start</Button>}
        {start && <Dashboard start={start} />}
      </header>
    </div>
  );
}

export default App;
