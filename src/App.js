import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

const axios = require('axios');


class App extends Component {

  state = {
    topics: []
  }
  componentDidMount () {
    axios.get('https://shumanator-nc-knews.herokuapp.com/api/topics')
      .then((response) => {
        //console.log(response);
        this.setState({topics: response.data.topics});
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div>
        <h1>The Black Hole</h1>
        <Button variant="primary">Primary</Button>
        {this.state.topics.map(topic => <p>{topic.slug}</p>)}
      </div>
    );
  }
}

export default App;
