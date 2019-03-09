import React , { Component, Fragment } from 'react';
import { makeAPICalls } from '../utils/APICalls';
import '../main.css';
import { Form, Button, FormControl, Modal, Alert } from 'react-bootstrap';

class NewTopicForm extends Component {    

    state = {
        inputTopic: '',
        inputTopicDesc: '',
        topicAddError: '',
        topicAdded: false
    }

    handleTextChange = ( event ) => {
        const { id, value } = event.target;
        this.setState( { [ id ]: value, topicAddError: '' } );
    }
        
    handleAddNewTopic = () => {
        const { inputTopicDesc, inputTopic } = this.state;
        const data = { slug: inputTopic, description: inputTopicDesc };
        const apiObj = {
            url: '/topics',
            reqObjectKey: 'topics',
            method: 'post',
            data
        };
        
        makeAPICalls( apiObj )
            .then( ( ) => this.setState( { topicAdded: true } ) )
            .catch( ( error ) => this.setState( { topicAdded: false, topicAddError: error } ) );       
    }
    render() {
        return (
            <Modal show={this.props.showNewTopicModal} onHide={this.props.handleNewTopicClose} size={this.props.size}>
                <Modal.Header size={this.props.size}>
                    <Modal.Title>Add a new Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form size={this.props.size}>
                        <Form.Group controlId="inputTopic">
                            <FormControl size={this.props.size} type="text" placeholder="Enter a new topic" onChange={this.handleTextChange}/>
                        </Form.Group>
                        <Form.Group controlId="inputTopicDesc">
                            <FormControl size={this.props.size} type="text" placeholder="Enter a description" onChange={this.handleTextChange}/>
                        </Form.Group>
                    </Form>
                    {
                        ( !this.state.topicAdded && this.state.topicAddError !== '' )
                            ? <Alert variant='danger'>Topic could not be added: {this.state.topicAddError}</Alert>
                            : this.state.topicAdded
                                ? <Alert variant='success'>Topic has been added</Alert>
                                : <Fragment/>                            
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button size={this.props.size} variant="primary" disabled={this.state.inputTopic === '' || this.state.topicAddError !== ''} onClick={this.handleAddNewTopic}>
                        Create new Topic
                    </Button>
                    <Button size={this.props.size} variant="secondary" onClick={this.props.handleNewTopicClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        );  
    }
  
}

export default NewTopicForm;