import React, { Component } from 'react';
import {Router} from '@reach/router';
import Header from './components/Header';
import UserDashboard from './components/UserDashboard';


class App extends Component {

  state = {
    loggedUser: null
  }
  componentDidMount () {
   if (localStorage.getItem('userLoggedIn')) {
     this.setState({loggedUser: localStorage.getItem('userLoggedIn')})
   }
  }

  render() {
    return (
      <div>
        <Header/>
        <Router>
          <UserDashboard path="/users/:username"/>
        </Router>        
      </div>
    );
  }

}

export default App;
