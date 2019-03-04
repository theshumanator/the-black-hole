import React, { Component } from 'react';
import Header from './components/Header';


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
      </div>
    );
  }

}

export default App;
