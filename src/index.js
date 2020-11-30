import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import firebase from 'firebase/app';
import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyCbVjXGYBzIA0Yx8HLGAcUO8NgJPyws7n0',
  authDomain: 'covid-simulator-5e28a.firebaseapp.com',
  databaseURL: 'https://covid-simulator-5e28a.firebaseio.com',
  projectId: 'covid-simulator-5e28a',
  storageBucket: 'covid-simulator-5e28a.appspot.com',
  messagingSenderId: '807313463537',
  appId: '1:807313463537:web:af71b60f87d5d7d7567150',
  measurementId: 'G-63MMZNN05M',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
