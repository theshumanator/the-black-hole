import React , {Component, Fragment} from 'react';
import {Link} from '@reach/router';
import '../main.css';
import {postNewArticle, getAllTopics, createNewTopic} from '../utils/APICalls';
import {Form, Button, FormControl, Modal, Alert, Row, Col} from 'react-bootstrap';

class NewArticleForm extends Component {
    state = {
        articlePostError: '',
        articlePosted: false,
        inputTitle: '',
        inputBody: '',
        inputTopic: '',
        availableTopics: [],
        selectTopicEnable: false, 
        createTopicEnable: false,
        topicAddError: '',
        topicAdded: false,
        newArticleId: null
    }

    handleTitleChange = (event) => {
        this.setState({ inputTitle: event.target.value, topicAddError: '', articlePostError: ''});
    }

    handleBodyChange = (event) => {
        this.setState({ inputBody: event.target.value, topicAddError: '', articlePostError: ''});
    }

    handleTopicChange = (event) => {        
        this.setState({ inputTopic: event.target.value, topicAddError: '', articlePostError: ''});
    }

    handleRadioChange = (event) => {
        const {id, value} = event.target;
        if (id==='selectTopicEnable'){
            this.setState({[id]: value==="true"? true: false, createTopicEnable: false})
        } else {
            this.setState({[id]: value==="true"? true: false, selectTopicEnable: false})
        }                 
    }

    handlePostNewArticle  = () => {
        const {inputTitle, inputBody, inputTopic, createTopicEnable} = this.state;
        const articleObj = {
            username: localStorage.getItem('userLoggedIn'),
            title: inputTitle,
            body: inputBody,
            topic: inputTopic
        }
        if (inputTopic==='') {
            //TODO alert
        } else {
            if (createTopicEnable) {
                createNewTopic({slug: inputTopic, description: inputTopic})
                    .then((data) => {
                        if ('topic' in data) {
                            this.doPostNewArticle(articleObj);
                        } else {
                            this.setState({topicAdded: false, topicAddError: data.msg})
                        }
                    })
                    .catch(error => console.log('got : ' + error))       
            } else {
                this.doPostNewArticle(articleObj);
            }
        }        
              
    }

    doPostNewArticle = (articleObj)=> {
        postNewArticle(articleObj)
            .then((data) => {                
                if ('article' in data) {
                    this.setState({articlePosted: true, articlePostError:'', newArticleId: data.article.article_id})
                } else {
                    this.setState({articlePosted: false, articlePostError: data.msg})
                }
            })
            .catch(error => console.log('got : ' + error)) 
    }
    
    componentDidMount () {
        getAllTopics()
            .then((data) => {
                this.setState({availableTopics: data});
            })
            .catch(error => console.log('got : ' + error))       
    }

    render () {        
        const {availableTopics, selectTopicEnable, createTopicEnable} = this.state;        
        return(
            <Modal show={this.props.showNewArticleModal} onHide={this.props.handleNewArticleClose}>
            <Modal.Header>
                <Modal.Title>Post a new article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTopics">
                        <Row>
                            <Col>
                                <Form.Check inline label="Select a topic" name="formTopicRadio" type="radio" id="selectTopicEnable" value="true" onChange={this.handleRadioChange}/>                                
                                <Form.Control as="select" disabled={!selectTopicEnable} onChange={this.handleTopicChange}>     
                                    <option value="placeholder">Choose a topic</option>
                                    {
                                        availableTopics && availableTopics.map(topic => {                     
                                            return (
                                                <option key={topic.slug}>{topic.slug}</option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </Col>
                            <Col>
                                <Form.Check inline label="Create a new topic" name="formTopicRadio" type="radio" id="createTopicEnable" value="true" onChange={this.handleRadioChange}/>
                                <FormControl type="text" placeholder="Enter a new topic" disabled={!createTopicEnable} onChange={this.handleTopicChange}/>
                            </Col>
                        </Row>                        
                    </Form.Group>
                    <Form.Group controlId="formTitle">
                        <FormControl type="text" placeholder="Enter article title" onChange={this.handleTitleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBody">
                        <FormControl as="textarea" rows="3" placeholder="Enter article body" onChange={this.handleBodyChange}/>
                    </Form.Group>
                </Form>
                {
                    (!this.state.topicAdded && this.state.topicAddError!=='')
                    ?   <Alert variant='danger'>Topic could not be added: {this.state.topicAddError}</Alert>
                    :   this.state.topicAdded
                        ?   <Alert variant='success'>Topic has been added</Alert>
                        :   <Fragment/>                            
                } 
                {
                    (!this.state.articlePosted && this.state.articlePostError!=='')
                    ?   <Alert variant='danger'>Article could not be added: {this.state.articlePostError}</Alert>
                    :   this.state.articlePosted
                        ?   <Alert variant='success'>Article has been posted. You can find it <Link to={`/articles/${this.state.newArticleId}`}>here</Link> or close to return to main page.</Alert>
                        :   <Fragment/>                            
                }                                    
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" disabled={this.state.topicAddError!=='' ||  this.state.articlePostError!=='' || this.state.inputTitle==='' || this.state.inputBody==='' || this.state.inputTopic===''} onClick={this.handlePostNewArticle}>
                    Post article
                </Button>
                <Button variant="secondary" onClick={this.props.handleNewArticleClose}>
                    Close
                </Button>            
            </Modal.Footer>
        </Modal>
        );
    }
}
export default NewArticleForm;