import React, { Component, Fragment } from 'react';
import {Form, Button, FormControl, Modal, Alert, Row, Col} from 'react-bootstrap';
import {createNewComment} from '../utils/APICalls';

class AddNewComment extends Component {
    state = {
        username: null,
        commentBody: '',
        commentAdded: false,
        commentAddError: 'none',
        newCommentId: null
    }
    
    handleAddNewComment = () => {
        createNewComment(this.props.articleId, {username: this.state.username, 
                            body: this.state.commentBody})
            .then((data) => {
                console.log(data)
                if ('comment' in data) {
                    this.setState({commentAdded: true, commentAddError:'none', newCommentId: data.comment.comment_id})
                } else {
                    this.setState({topicAdded: false, topicAddError: data.msg})
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    handleCommentChange = (event) => {
        this.setState({commentBody: event.target.value, commentAdded: false, commentAddError: 'none', newCommentId: null})
    }
    componentDidMount () {
        this.setState({username: this.props.loggedUser});        
    }
    render () {
        return (
            <Modal show={this.props.showNewCommentModal} onHide={this.props.handleNewCommentClose}>
                <Modal.Header>
                    <Modal.Title>Post a comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formComment">
                            <FormControl as="textarea" rows="3" placeholder="Enter your comment" onChange={this.handleCommentChange}/>
                        </Form.Group>
                    </Form>
                   { 
                        (!this.state.commentAdded && this.state.commentAddError!=='none')
                        ?   <Alert variant='danger'>Topic could not be added: {this.state.commentAddError}</Alert>
                        :   this.state.commentAdded
                            ?   <Alert variant='success'>Topic has been added</Alert>
                            :   <Fragment/>                            
                    }                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleAddNewComment}>
                        Create new Topic
                    </Button>
                    <Button variant="secondary" onClick={this.props.handleNewCommentClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        )
    }
}

export default AddNewComment;
