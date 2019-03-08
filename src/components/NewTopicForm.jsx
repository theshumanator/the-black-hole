import React , {Component, Fragment} from 'react';
import {createNewTopic} from '../utils/APICalls';
import '../main.css';
import {Form, Button, FormControl, Modal, Alert} from 'react-bootstrap';


 class NewTopicForm extends Component {    

    state = {
        inputTopic: '',
        inputTopicDesc: '',
        topicAddError: '',
        topicAdded: false
    }

    handleTopicSlugChange = (event) => {
        this.setState({ inputTopic: event.target.value, topicAddError: ''});
    }
    handleTopicDescriptionChange = (event) => {
        this.setState({ inputTopicDesc: event.target.value});
    }


    handleAddNewTopic = () => {
        createNewTopic({slug: this.state.inputTopic, description: this.state.inputTopicDesc})
            .then((data) => {                    
                if ('topic' in data) {
                    this.setState({topicAdded: true})
                } else {
                    this.setState({topicAdded: false, topicAddError: data.msg})
                }                                        
            })
            .catch(error => console.log('got : ' + error))       
    }
    render() {
        return (
            <Modal show={this.props.showNewTopicModal} onHide={this.props.handleNewTopicClose} size={this.props.size}>
                <Modal.Header size={this.props.size}>
                    <Modal.Title>Add a new Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form size={this.props.size}>
                        <Form.Group controlId="formTopic">
                            <FormControl size={this.props.size} type="text" placeholder="Enter a new topic" onChange={this.handleTopicSlugChange}/>
                        </Form.Group>
                        <Form.Group controlId="formDesc">
                            <FormControl size={this.props.size} type="text" placeholder="Enter a description" onChange={this.handleTopicDescriptionChange}/>
                        </Form.Group>
                    </Form>
                    {
                        (!this.state.topicAdded && this.state.topicAddError!=='')
                        ?   <Alert variant='danger'>Topic could not be added: {this.state.topicAddError}</Alert>
                        :   this.state.topicAdded
                            ?   <Alert variant='success'>Topic has been added</Alert>
                            :   <Fragment/>                            
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button size={this.props.size} variant="primary" disabled={this.state.inputTopic==='' || this.state.topicAddError!==''} onClick={this.handleAddNewTopic}>
                        Create new Topic
                    </Button>
                    <Button size={this.props.size} variant="secondary" onClick={this.props.handleNewTopicClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        )  
    }
  
}

export default NewTopicForm;