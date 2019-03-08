import React, { Component, Fragment } from 'react';
import {Form, Button, FormControl, Modal, Alert} from 'react-bootstrap';
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
                if ('comment' in data) {
                    this.setState({commentAdded: true, commentAddError:'none', newCommentId: data.comment.comment_id})
                } else {
                    this.setState({commentAdded: false, commentAddError: data.msg})
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    handleCommentChange = (event) => {
        this.setState({commentBody: event.target.value, commentAdded: false, commentAddError: 'none', newCommentId: null})
    }
    componentDidUpdate(){
        if (this.state.newCommentId!==null && this.state.commentAdded && this.state.commentAddError==='none') {
            this.props.handleNewCommentClose();
        }
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
                        ?   <Alert variant='danger'>Comment could not be added: {this.state.commentAddError}</Alert>
                        :   this.state.commentAdded
                            ?   <Alert variant='success'>Comment has been added</Alert>
                            :   <Fragment/>                            
                    }                   
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={this.state.commentBody===''} variant="primary" onClick={this.handleAddNewComment}>
                        Post comment
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
