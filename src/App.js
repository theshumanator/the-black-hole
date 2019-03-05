import React, { Component } from 'react';
import {Router} from '@reach/router';
import Header from './components/Header';
import UserDashboard from './components/UserDashboard';
import HomeBody from './components/HomeBody';
import SingleArticle from './components/SingleArticle';


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
          <HomeBody path='/'/>
          <UserDashboard path='/users/:username'/>
          <SingleArticle path='/articles/:articleId'/>          
        </Router>        
      </div>
    );
  }

}

export default App;
