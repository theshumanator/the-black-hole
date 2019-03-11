import React , { Component, Fragment } from 'react';
import { makeAPICalls } from '../utils/APICalls';
import '../main.css';
import { Form, Button, FormControl, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

class NewTopicForm extends Component {    

    //avoid memory leak cancel all axios requests, etc
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    _isMounted = false;

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
            data,
            cancelToken: this.source.token,
        };
        
        this._isMounted && makeAPICalls( apiObj )
            .then( ( ) => this.setState( { topicAdded: true } ) )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { topicAdded: false, topicAddError: error } );
                }
            } );       
    }

    componentDidMount () {        
        this._isMounted = true;             
    }

    componentWillUnmount () {                
        this.source.cancel( 'Cancel axios requests as user moved off page' );        
        this._isMounted = false;
    }

    render() {
        const { inputTopic, topicAddError,topicAdded } = this.state;    
        const { showNewTopicModal, handleNewTopicClose, size } = this.props;
        const disableAddTopic = ( inputTopic === '' || topicAddError !== '' );
        const hasAddTopicError = ( !topicAdded && topicAddError !== '' );
        return (
            <Modal show={showNewTopicModal} onHide={handleNewTopicClose} size={size}>
                <Modal.Header size={size}>
                    <Modal.Title>Add a new Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form size={size}>
                        <Form.Group controlId="inputTopic">
                            <FormControl size={size} type="text" placeholder="Enter a new topic" onChange={this.handleTextChange}/>
                        </Form.Group>
                        <Form.Group controlId="inputTopicDesc">
                            <FormControl size={size} type="text" placeholder="Enter a description" onChange={this.handleTextChange}/>
                        </Form.Group>
                    </Form>
                    {
                        hasAddTopicError
                            ? <Alert variant='danger'>Topic could not be added: {topicAddError}</Alert>
                            : topicAdded
                                ? <Alert variant='success'>Topic has been added</Alert>
                                : <Fragment/>                            
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button size={size} variant="primary" disabled={disableAddTopic} onClick={this.handleAddNewTopic}>
                        Create new Topic
                    </Button>
                    <Button size={size} variant="secondary" onClick={handleNewTopicClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        );  
    }
  
}

export default NewTopicForm;