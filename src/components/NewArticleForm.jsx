import React , { Component, Fragment } from 'react';
import { Link } from '@reach/router';
import '../main.css';
import { makeAPICalls } from '../utils/APICalls';
import { Form, Button, FormControl, Modal, Alert, Row, Col } from 'react-bootstrap';

class NewArticleForm extends Component {
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
                data
            };
            makeAPICalls( apiObj )
                .then( ( ) => this.postNewArticle( articleObj ) )
                .catch( ( error ) => {
                    this.setState( { topicAdded: false, topicAddError: error } );
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
            data
        };
        makeAPICalls( apiObj )
            .then( ( article ) => {         
                this.setState( { articlePosted: true, articlePostError: '', newArticleId: article.article_id } );
            } )
            .catch( ( error ) => this.setState( { articlePosted: false, articlePostError: error } ) ); 
    }
    
    getAllTopics = () => {
        const apiObj = {
            url: '/topics/',
            reqObjectKey: 'topics',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( ( topics ) => {
                this.setState( { topics } );
            } )
            .catch( ( ) => this.setState( { topics: [] } ) ); 
    }
    componentDidMount () {
        this.getAllTopics();             
    }

    render () {        
        const { topics, selectTopicEnable, createTopicEnable } = this.state;        
        return (
            <Modal show={this.props.showNewArticleModal} onHide={this.props.handleNewArticleClose} size={this.props.size}>
                <Modal.Header>
                    <Modal.Title>Post a new article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="inputTopic">
                            <Row>
                                <Col>
                                    <Form.Check inline label="Select a topic" name="formTopicRadio" type="radio" id="selectTopicEnable" value="true" onChange={this.handleRadioChange}/>                                
                                    <Form.Control as="select" disabled={!selectTopicEnable} onChange={this.handleTextChange}>     
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
                                    <FormControl type="text" placeholder="Enter a new topic" disabled={!createTopicEnable} onChange={this.handleTextChange}/>
                                </Col>
                            </Row>                        
                        </Form.Group>
                        <Form.Group controlId="inputTitle">
                            <FormControl type="text" placeholder="Enter article title" onChange={this.handleTextChange}/>
                        </Form.Group>
                        <Form.Group controlId="inputBody">
                            <FormControl as="textarea" rows="3" placeholder="Enter article body" onChange={this.handleTextChange}/>
                        </Form.Group>
                    </Form>
                    {
                        ( !this.state.topicAdded && this.state.topicAddError !== '' )
                            ? <Alert variant='danger'>Topic could not be added: {this.state.topicAddError}</Alert>
                            : this.state.topicAdded
                                ? <Alert variant='success'>Topic has been added</Alert>
                                : <Fragment/>                            
                    } 
                    {
                        ( !this.state.articlePosted && this.state.articlePostError !== '' )
                            ? <Alert variant='danger'>Article could not be added: {this.state.articlePostError}</Alert>
                            : this.state.articlePosted
                                ? <Alert variant='success'>Article has been posted. You can find it <Link to={`/articles/${ this.state.newArticleId }`}>here</Link> or close to return to main page.</Alert>
                                : <Fragment/>                            
                    }                                    
                </Modal.Body>
                <Modal.Footer>
                    <Button size={this.props.size} variant="primary" disabled={this.state.topicAddError !== '' || this.state.articlePostError !== '' || this.state.inputTitle === '' || this.state.inputBody === '' || this.state.inputTopic === ''} onClick={this.handlePostNewArticle}>
                    Post article
                    </Button>
                    <Button size={this.props.size} variant="secondary" onClick={this.props.handleNewArticleClose}>
                    Close
                    </Button>            
                </Modal.Footer>
            </Modal>
        );
    }
}
export default NewArticleForm;