import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './components/LoginComponent/Login';
import Signup from './components/SignUpComponent/SignUp';
import MainComponent from './components/MainComponent/MainComponent';
import OrderPayment from './components/OrderComponent/OrderComponent';
import Hoc from './hoc/hoc';
import NoMatch from './components/NoMatch/NoMatch';
export default class App extends Component {
  render() {
    let loggedIn = localStorage.getItem('customerId');
    return (
      <Hoc>
        <Switch>
          <Route path="/" exact component={
            loggedIn ? MainComponent : Login
          } />
          <Route path="/login" exact component={Login} />
          <Route path="/Signup" exact component={Signup} />
          <Route path="/feeds" exact component={MainComponent} />
          <Route path="/orderpayment" exact component={OrderPayment} />
          <Route component={NoMatch} />
        </Switch>
      </Hoc>
    );
  }
}
