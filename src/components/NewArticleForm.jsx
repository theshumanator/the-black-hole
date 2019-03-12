import React , { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import '../main.css';
import { makeAPICalls } from '../utils/APICalls';
import { Form, Button, FormControl, Modal, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

class NewArticleForm extends Component {

    //avoid memory leak cancel all axios requests, etc
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    _isMounted = false;
    
    state = {
        articlePostError: '',
        articlePosted: false,
        inputTitle: '',
        inputBody: '',
        inputTopic: '',
        topics: [],
        selectTopicEnable: false, 
        createTopicEnable: false,
        topicAddError: '',
        topicAdded: false,
        newArticleId: null
    }
   
    handleTextChange = ( event ) => {      
        const { id, value } = event.target;
        this.setState( { [ id ]: value, topicAddError: '', articlePostError: '' } );
    }

    handleRadioChange = ( event ) => {
        const { id, value } = event.target;
        if ( id === 'selectTopicEnable' ){
            this.setState( { [ id ]: value === 'true' ? true : false, createTopicEnable: false } );
        } else {
            this.setState( { [ id ]: value === 'true' ? true : false, selectTopicEnable: false } );
        }                 
    }

    handlePostNewArticle = () => {
        const { inputTitle, inputBody, inputTopic, createTopicEnable } = this.state;
        const articleObj = {
            username: localStorage.getItem( 'userLoggedIn' ),
            title: inputTitle,
            body: inputBody,
            topic: inputTopic
        };
        if ( createTopicEnable ) {
            const data = { slug: inputTopic, description: inputTopic };
            const apiObj = {
                url: '/topics',
                reqObjectKey: 'topics',
                method: 'post',
                data,
                cancelToken: this.source.token,
            };
            this._isMounted && makeAPICalls( apiObj )
                .then( ( ) => this.postNewArticle( articleObj ) )
                .catch( ( error ) => {
                    if ( !axios.isCancel( error ) ) {
                        this.setState( { topicAdded: false, topicAddError: error } );
                    }                    
                } );       
        } else {
            this.postNewArticle( articleObj );
        }
    }

    postNewArticle = ( data ) => {
        const apiObj = {
            url: '/articles',
            reqObjectKey: 'article',
            method: 'post',
            data,
            cancelToken: this.source.token,
        };
        this._isMounted && makeAPICalls( apiObj )
            .then( ( article ) => {         
                this.formArticleBody.value = '';
                this.formArticleTopic.value = '';
                this.formArticleTitle.value = '';
                this.formArticleTopicSelect.selectedIndex = 0;
                this.setState( { articlePosted: true, articlePostError: '', newArticleId: article.article_id } );
            } )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { articlePosted: false, articlePostError: error } ); 
                }
            } ); 
    }
    
    getAllTopics = () => {
        const apiObj = {
            url: '/topics/',
            reqObjectKey: 'topics',
            method: 'get',
            cancelToken: this.source.token,
        };
        this._isMounted && makeAPICalls( apiObj )
            .then( ( topics ) => {
                this.setState( { topics } );
            } )
            .catch( ( err ) => {
                if ( !axios.isCancel( err ) ) {
                    this.setState( { topics: [] } ); 
                }
            } ); 
    }
    componentDidMount () {
        this._isMounted = true;     
        this.getAllTopics();             
    }

    componentWillUnmount () {                
        this.source.cancel( 'Cancel axios requests as user moved off page' );   
        this._isMounted = false;
    }

    render () {        
        const { topics, selectTopicEnable, createTopicEnable, topicAddError, articlePostError,
            inputTitle, inputBody, inputTopic, topicAdded, articlePosted, newArticleId } = this.state;   
        
        const { showNewArticleModal, handleNewArticleClose, size } = this.props;
        const disablePostNewArticle = ( topicAddError !== '' || articlePostError !== '' 
            || inputTitle === '' || inputBody === '' || inputTopic === '' );

        return (
            <Modal show={showNewArticleModal} onHide={handleNewArticleClose} size={size}>
                <Modal.Header>
                    <Modal.Title>Post a new article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="inputTopic">
                            <Row>
                                <Col>
                                    <Form.Check inline label="Select a topic" name="formTopicRadio" type="radio" id="selectTopicEnable" value="true" onChange={this.handleRadioChange}/>                                
                                    <Form.Control as="select" disabled={!selectTopicEnable} onChange={this.handleTextChange} ref={node => this.formArticleTopicSelect = node}>     
                                        <option value="placeholder">Choose a topic</option>
                                        {
                                            topics && topics.map( topic => {                     
                                                return (
                                                    <option key={topic.slug}>{topic.slug}</option>
                                                );
                                            } )
                                        }
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Check inline label="Create a new topic" name="formTopicRadio" type="radio" id="createTopicEnable" value="true" onChange={this.handleRadioChange}/>
                                    <FormControl type="text" placeholder="Enter a new topic" disabled={!createTopicEnable} onChange={this.handleTextChange} ref={node => this.formArticleTopic = node}/>
                                </Col>
                            </Row>                        
                        </Form.Group>
                        <Form.Group controlId="inputTitle">
                            <FormControl type="text" placeholder="Enter article title" onChange={this.handleTextChange} ref={node => this.formArticleTitle = node}/>
                        </Form.Group>
                        <Form.Group controlId="inputBody">
                            <FormControl as="textarea" rows="3" placeholder="Enter article body" onChange={this.handleTextChange} ref={node => this.formArticleBody = node}/>
                        </Form.Group>
                    </Form>
                    {
                        ( !topicAdded && topicAddError !== '' )
                            ? <Alert variant='danger'>Topic could not be added: {topicAddError}</Alert>
                            : topicAdded
                                ? <Alert variant='success'>Topic has been added</Alert>
                                : <Fragment/>                            
                    } 
                    {
                        ( !articlePosted && articlePostError !== '' )
                            ? <Alert variant='danger'>Article could not be added: {articlePostError}</Alert>
                            : articlePosted
                                ? <Alert variant='success'>Article has been posted. You can find it 
                                    <Link to={`/articles/${ newArticleId }`}> here</Link> or close to return to main page.</Alert>
                                : <Fragment/>                            
                    }                                    
                </Modal.Body>
                <Modal.Footer>
                    <Button size={size} variant="primary" disabled={disablePostNewArticle} onClick={this.handlePostNewArticle}>
                    Post article
                    </Button>
                    <Button size={size} variant="secondary" onClick={handleNewArticleClose}>
                    Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        );
    }
}

NewArticleForm.propTypes = {
    handleNewArticleClose: PropTypes.func,
    showNewArticleModal: PropTypes.bool,
    size: PropTypes.string,    
};

export default NewArticleForm;