import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Route,BrowserRouter as Router} from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';
const firebase=require('firebase');
require('firebase/firestore');
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
firebase.initializeApp(firebaseConfig);
const routing=(
    <Router>
      <div id="routing-container">
        <Route path='/login' exact component={LoginComponent}></Route>
        <Route path='/' exact component={DashboardComponent}></Route>
        <Route path='/signup' component={SignupComponent}></Route>
        <Route path='/dashboard' component={DashboardComponent}></Route>
      </div>
    </Router>
);
ReactDOM.render(routing,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
