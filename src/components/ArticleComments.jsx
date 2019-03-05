import React, { Component, Fragment } from 'react';
import {Row, Col, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import {getArticleComments, updateCommentVote} from '../utils/APICalls'
import SingleComment from './SingleComment';
import AddNewComment from './AddNewComment';
class ArticleComments extends Component {

    state = {
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        comments: [],
        reQuery: true,
        showNewCommentModal: false    
    }


    handleNewCommentClose = () => {
        console.log('Closing new comment modal')
        this.setState({showNewCommentModal: false, reQuery: true});
    } 


    handleAddNewComment = () => {
        this.setState({showNewCommentModal: true, reQuery: false});
    }

    handleDeleteDone = () => {
        this.setState({reQuery: true});
    }

    handleSortSelect = (eventKey) => {
        console.log(eventKey);
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true});
    }

    componentDidMount () {        
       this.fetchComments();
    }

    componentDidUpdate () {
        if(this.state.reQuery) {
            this.fetchComments();
        }        
    }

    fetchComments () {
        getArticleComments(this.props.article.article_id, {sort_by: this.state.sortByKey, order: this.state.sortOrder})
        .then((comments) => {
            if (!Array.isArray(comments)) {
                this.setState({comments: [], reQuery: false})
            } else {
                this.setState({comments, reQuery: false})
            }            
        })
        .catch(error => console.log('got : ' + error))
    }

    render () {
        const {article, loggedUser} = this.props;
        const {comments, showNewCommentModal} = this.state;        
        
        return (
            <div>
                <p>Comments: {comments.length}</p>
                <Row>
                    <Col xs={3}>
                        {
                            <DropdownButton id="dropdown-basic-button" title="Sort By" variant='secondary'>
                                <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                                <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                                <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                                <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                                <Dropdown.Item eventKey="author asc" onSelect={this.handleSortSelect}>Author (A-Z)</Dropdown.Item>
                                <Dropdown.Item eventKey="author desc" onSelect={this.handleSortSelect}>Author (Z-A)</Dropdown.Item>                        
                            </DropdownButton>
                        }
                    </Col>
                    <Col>
                        {
                            loggedUser && <Button variant="primary" onClick={this.handleAddNewComment}>Add a Comment</Button>
                        }
                    </Col>                    
                </Row>            
                {
                    showNewCommentModal && loggedUser && <AddNewComment articleId={article.article_id} loggedUser={this.props.loggedUser} showNewCommentModal={showNewCommentModal} handleNewCommentClose={this.handleNewCommentClose}/>
                }
                {
                    comments && comments.map((comment) => {
                       return <SingleComment key={comment.comment_id} articleId={article.article_id} comment={comment} loggedUser={this.props.loggedUser} handleDeleteDone={this.handleDeleteDone}/>
                    })
                }
                
            </div>
            
        )
    }
}
export default ArticleComments;