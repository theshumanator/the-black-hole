import React , {Component, Fragment} from 'react';
import {createNewTopic} from '../utils/APICalls';
import '../main.css';
import {Form, Button, FormControl, Modal, Alert} from 'react-bootstrap';


 class NewTopicForm extends Component {    

    state = {
        inputTopic: '',
        inputTopicDesc: '',
        topicAddError: 'none',
        topicAdded: false
    }

    handleTopicSlugChange = (event) => {
        this.setState({ inputTopic: event.target.value});
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
            <Modal show={this.props.showNewTopicModal} onHide={this.props.handleNewTopicClose}>
                <Modal.Header>
                    <Modal.Title>Add a new Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTopic">
                            <FormControl type="text" placeholder="Enter a new topic" onChange={this.handleTopicSlugChange}/>
                        </Form.Group>
                        <Form.Group controlId="formDesc">
                            <FormControl type="text" placeholder="Enter a description" onChange={this.handleTopicDescriptionChange}/>
                        </Form.Group>
                    </Form>
                    {
                        (!this.state.topicAdded && this.state.topicAddError!=='none')
                        ?   <Alert variant='danger'>Topic could not be added: {this.state.topicAddError}</Alert>
                        :   this.state.topicAdded
                            ?   <Alert variant='success'>Topic has been added</Alert>
                            :   <Fragment/>                            
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleAddNewTopic}>
                        Create new Topic
                    </Button>
                    <Button variant="secondary" onClick={this.props.handleNewTopicClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        )  
    }
  
}

export default NewTopicForm;