import React, {Component, Fragment} from 'react';
import {Modal, Button, FormControl, Form, Alert} from 'react-bootstrap'
import {createNewUser} from '../utils/APICalls';

class SignupForm extends Component {
  state = {
    newUserAdded: false,
    userAddError: '',
    inputUsername: '',
    inputName: '',
    inputAvatar: 'https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg' //setting a default avatar
  }

  handleUsernameChange = (event) => {
    this.setState({ inputUsername: event.target.value, userAddError: ''});
  }

  handleNameChange = (event) => {
      this.setState({ inputName: event.target.value, userAddError: ''});   
  }

  handleAvatarChange = (event) => {
      this.setState({ inputAvatar: event.target.value, userAddError: ''});
  }

  handleSignup = () => {
    if (this.state.inputUsername==='' || this.state.inputName==='') {
        console.log('either username or name are blank')
        //TODO alert
    } else {
        const newUser = {
            username: this.state.inputUsername, 
            name: this.state.inputName, 
            avatar_url: this.state.inputAvatar
        };

        createNewUser(newUser)
            .then((data) => {
                if ('user' in data) {
                    localStorage.setItem('userLoggedIn', data.user.username);
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userAvatar', data.user.avatar_url);
                    this.setState({newUserAdded: true});                         
                } else {
                    console.log('User couldnt be added : ' + data.msg);                            this.setState({newUserAdded: false, userAddError: data.msg})
                }
            })
            .catch(error => console.log('got : ' + error))
    }
  }

  render () {
    return (
      <Modal show={this.props.showSignupModal} onHide={this.props.handleSignupClose}>
       <Modal.Header>
         <Modal.Title>Sign up</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <Form>
             <Form.Group controlId="formUsername">
                 <FormControl type="text" placeholder="Enter your username (mandatory)" onChange={this.handleUsernameChange}/>
             </Form.Group>
             <Form.Group controlId="formName">
                 <FormControl type="text" placeholder="Enter your name (mandatory)" onChange={this.handleNameChange}/>
             </Form.Group >
             <Form.Group controlId="formAvatar">
                 <FormControl type="text" placeholder="Enter your avatar url (optional)" onChange={this.handleAvatarChange}/>
             </Form.Group >
         </Form>
         {
            (!this.state.newUserAdded && this.state.userAddError!=='')
            ?   <Alert variant='danger'>Could not sign you up: {this.state.userAddError}</Alert>
            :   this.state.newUserAdded
                ?   <Alert variant='success'>Sign up successful! You have also been logged in.</Alert>
                :   <Fragment/>                            
          } 
       </Modal.Body>
       <Modal.Footer>
       <Button variant="primary" onClick={this.handleSignup} disabled={this.state.inputUsername==='' || this.state.inputName===''}>
           Sign up
         </Button>
         <Button variant="secondary" onClick={this.props.handleSignupClose}>
           Close
         </Button>            
       </Modal.Footer>
     </Modal>
    )
  }
        
};

export default SignupForm;