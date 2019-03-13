import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, FormControl, Modal, Alert } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import axios from 'axios';

class NewCommentModal extends Component {
    
    //avoid memory leak cancel all axios requests, etc
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
    _isMounted = false;
    
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
            data,
            cancelToken: this.source.token,
        };

        this._isMounted && makeAPICalls( apiObj )
            .then( ( { comment_id } ) => {                
                this.setState( { commentAdded: true, commentAddError: 'none', newCommentId: comment_id } );                
            } )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { commentAdded: false, commentAddError: error } ); 
                }
            } );
    }

    handleCommentChange = ( event ) => {
        this.setState( { commentBody: event.target.value, commentAdded: false, commentAddError: 'none', newCommentId: null } );
    }
    componentDidUpdate(){
        const { newCommentId, commentAdded, commentAddError } = this.state;
        if ( newCommentId !== null && commentAdded && commentAddError === 'none' ) {
            this.props.handleNewCommentClose();
        }
    }
    componentDidMount () {
        this._isMounted = true;     
        this.setState( { username: this.props.loggedUser } );        
    }

    componentWillUnmount () {
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        this._isMounted = false;
    }
    
    render () {
        const { showNewCommentModal, handleNewCommentClose, } = this.props;
        const { commentAdded, commentAddError, commentBody } = this.state;

        return (
            <Modal show={showNewCommentModal} onHide={handleNewCommentClose}>
                <Modal.Header>
                    <Modal.Title>Post a comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formComment">
                            <FormControl data-cy="formComment" as="textarea" rows="3" placeholder="Enter your comment" onChange={this.handleCommentChange}/>
                        </Form.Group>
                    </Form>
                    { 
                        ( !commentAdded && commentAddError !== 'none' )
                            ? <Alert variant='danger'>Comment could not be added: {commentAddError}</Alert>
                            : commentAdded
                                ? <Alert variant='success'>Comment has been added</Alert>
                                : <Fragment/>                            
                    }                   
                </Modal.Body>
                <Modal.Footer>
                    <Button data-cy="postNewComment" disabled={commentBody === ''} variant="primary" onClick={this.handleAddNewComment}>
                        Post comment
                    </Button>
                    <Button variant="secondary" onClick={handleNewCommentClose}>
                        Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        );
    }
}

NewCommentModal.propTypes = {
    showNewCommentModal: PropTypes.bool,
    handleNewCommentClose: PropTypes.func,
    articleId: PropTypes.number,    
    loggedUser: PropTypes.string,    
};

export default NewCommentModal;
