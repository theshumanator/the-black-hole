import React, { Component, Fragment } from 'react';
import { Modal, Button, FormControl, Form, Alert } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';

class SignupForm extends Component {
  state = {
      newUserAdded: false,
      userAddError: '',
      inputUsername: '',
      inputName: '',
      inputAvatar: 'https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg' //setting a default avatar
  }

  handleTextChange = ( event ) => {
      const { id, value } = event.target;
      this.setState( { [ id ]: value, userAddError: '' } );
  }

  handleSignup = () => {   
      const { inputUsername, inputName, inputAvatar } = this.state;   
      const data = {
          username: inputUsername, 
          name: inputName, 
          avatar_url: inputAvatar
      };

      const apiObj = {
          url: '/users',
          reqObjectKey: 'user',
          method: 'post',
          data
      };

      makeAPICalls( apiObj )
          .then( ( user ) => {               
              localStorage.setItem( 'userLoggedIn', user.username );
              localStorage.setItem( 'userName', user.name );
              localStorage.setItem( 'userAvatar', user.avatar_url );
              this.setState( { newUserAdded: true }, () => {
                  this.props.handleNewUserAdded();
              } );  
          } )
          .catch( ( error ) => {                            
              this.setState( { newUserAdded: false, userAddError: error } );
          } );
      
  }

  render () {
      const { showSignupModal, handleSignupClose } = this.props;
      const { newUserAdded, userAddError, inputUsername,inputName } = this.state;
      const hasSignupError = !newUserAdded && userAddError !== '' ;
      const disabledSignup = ( inputUsername === '' || inputName === '' );

      return (
          <Modal show={showSignupModal} onHide={handleSignupClose}>
              <Modal.Header>
                  <Modal.Title>Sign up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form>
                      <Form.Group controlId="inputUsername">
                          <FormControl type="text" placeholder="Enter your username (mandatory)" onChange={this.handleTextChange}/>
                      </Form.Group>
                      <Form.Group controlId="inputName">
                          <FormControl type="text" placeholder="Enter your name (mandatory)" onChange={this.handleTextChange}/>
                      </Form.Group >
                      <Form.Group controlId="inputAvatar">
                          <FormControl type="text" placeholder="Enter your avatar url (optional)" onChange={this.handleTextChange}/>
                      </Form.Group >
                  </Form>
                  {
                      hasSignupError
                          ? <Alert variant='danger'>Could not sign you up: {userAddError}</Alert>
                          : newUserAdded
                              ? <Alert variant='success'>Sign up successful! You have also been logged in.</Alert>
                              : <Fragment/>                            
                  } 
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="primary" onClick={this.handleSignup} disabled={disabledSignup}>
           Sign up
                  </Button>
                  <Button variant="secondary" onClick={handleSignupClose}>
           Close
                  </Button>            
              </Modal.Footer>
          </Modal>
      );
  }
        
}

export default SignupForm;