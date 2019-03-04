import React from 'react';
import {Modal, Button, FormControl, Form} from 'react-bootstrap'

const SignupForm = (props) => {
        return (
             <Modal show={props.showSignupModal} onHide={props.handleSignupClose}>
              <Modal.Header>
                <Modal.Title>Sign up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                    <Form.Group controlId="formUsername">
                        <FormControl type="text" placeholder="Enter your username" onChange={props.handleUsernameChange}/>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <FormControl type="text" placeholder="Enter your name" onChange={props.handleNameChange}/>
                    </Form.Group >
                    <Form.Group controlId="formAvatar">
                        <FormControl type="text" placeholder="Enter your avatar url" onChange={props.handleAvatarChange}/>
                    </Form.Group >
                </Form>
              </Modal.Body>
              <Modal.Footer>
              <Button variant="primary" onClick={props.handleSignup}>
                  Sign up
                </Button>
                <Button variant="secondary" onClick={props.handleSignupClose}>
                  Close
                </Button>            
              </Modal.Footer>
            </Modal>
        )
};

export default SignupForm;