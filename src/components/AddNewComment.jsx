import React, { Component, Fragment } from 'react';
import { Form, Button, FormControl, Modal, Alert } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';

class AddNewComment extends Component {
    state = {
        username: null,
        commentBody: '',
        commentAdded: false,
        commentAddError: 'none',
        newCommentId: null
    }
    
    handleAddNewComment = () => {
        const { articleId } = this.props;
        const { username, commentBody } = this.state;        
        const data = { username, body: commentBody };
        
        const apiObj = {
            url: `/articles/${ articleId }/comments`,
            reqObjectKey: 'comment',
            method: 'post',
            data
        };

        makeAPICalls( apiObj )
            .then( ( { comment_id } ) => {                
                this.setState( { commentAdded: true, commentAddError: 'none', newCommentId: comment_id } );                
            } )
            .catch( ( error ) => this.setState( { commentAdded: false, commentAddError: error } ) );
    }

    handleCommentChange = ( event ) => {
        this.setState( { commentBody: event.target.value, commentAdded: false, commentAddError: 'none', newCommentId: null } );
    }
    componentDidUpdate(){
        if ( this.state.newCommentId !== null && this.state.commentAdded && this.state.commentAddError === 'none' ) {
            this.props.handleNewCommentClose();
        }
    }
    componentDidMount () {
        this.setState( { username: this.props.loggedUser } );        
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
                        ( !this.state.commentAdded && this.state.commentAddError !== 'none' )
                            ? <Alert variant='danger'>Comment could not be added: {this.state.commentAddError}</Alert>
                            : this.state.commentAdded
                                ? <Alert variant='success'>Comment has been added</Alert>
                                : <Fragment/>                            
                    }                   
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={this.state.commentBody === ''} variant="primary" onClick={this.handleAddNewComment}>
                        Post comment
                    </Button>
                    <Button variant="secondary" onClick={this.props.handleNewCommentClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AddNewComment;
