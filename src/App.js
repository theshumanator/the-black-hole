import React, { Component } from 'react';
import { Router } from '@reach/router';
import Header from './components/Header';
import UserDashboard from './components/UserDashboard';
import HomeBody from './components/HomeBody';
import SingleArticle from './components/SingleArticle';
import SingleTopic from './components/SingleTopic';
import UsersList from './components/UsersList';

class App extends Component {

  state = {
      loggedUser: null,
      newUserAdded: false    
    
  }
  componentDidMount () {
      if ( localStorage.getItem( 'userLoggedIn' ) ) {
          this.setState( { loggedUser: localStorage.getItem( 'userLoggedIn' ) } );
      }
  }

  updateUser = () => {
      if ( localStorage.getItem( 'userLoggedIn' ) ) {
          this.setState( { loggedUser: localStorage.getItem( 'userLoggedIn' ) } );
      } else {
          this.setState( { loggedUser: null, newUserAdded: false } );
      }
  }

  handleNewUserAdded = () => {
      this.setState( { newUserAdded: true } , () => this.updateUser() );
  }
  
  render () { 
      const { loggedUser, newUserAdded } = this.state;           
      return (          
          <div className="appDiv">
              <Header updateUser={this.updateUser} handleNewUserAdded={this.handleNewUserAdded}/>
              <Router>
                  <HomeBody path='/' loggedUser={loggedUser}/>
                  {/* <NewHomeBody path='/new' loggedUser={loggedUser}/> */}
                  <UserDashboard path='/users/:username' loggedUser={loggedUser} />
                  <UsersList path='/users' newUserAdded={newUserAdded}/>
                  <SingleArticle path='/articles/:articleId' loggedUser={loggedUser}/>          
                  <SingleTopic path='/topics/:slug'/>
              </Router>        
          </div>
      );
  }

}

export default App;
