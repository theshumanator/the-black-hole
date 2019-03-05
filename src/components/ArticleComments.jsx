import React, { Component, Fragment } from 'react';
import {Card, Button} from 'react-bootstrap';
import {getArticleComments, updateCommentVote} from '../utils/APICalls'
import SingleComment from './SingleComment';
import AddNewComment from './AddNewComment';
class ArticleComments extends Component {

    state = {
        comments: [],
        showNewCommentModal: false    
    }


    handleNewCommentClose = () => {
        console.log('Closing new comment modal')
        this.setState({showNewCommentModal: false});
    } 


    handleAddNewComment = () => {
        this.setState({showNewCommentModal: true});
    }
    componentDidMount () {        
        getArticleComments(this.props.article.article_id)
            .then((comments) => {
                console.log(comments)
                this.setState({comments})
            })
            .catch(error => console.log('got : ' + error))
    }

    render () {
        const {article, loggedUser} = this.props;
        const {comments, showNewCommentModal} = this.state;        
        
        return (
            <div>
                <p>Comments: {article.comment_count}</p>
                <Button variant="primary" size="sm" onClick={this.handleAddNewComment}>Add a Comment</Button>
                {
                    showNewCommentModal && loggedUser && <AddNewComment articleId={article.article_id} loggedUser={this.props.loggedUser} showNewCommentModal={showNewCommentModal} handleNewCommentClose={this.handleNewCommentClose}/>
                }
                {
                    comments && comments.map((comment) => {
                       return <SingleComment key={comment.comment_id} articleId={article.article_id} comment={comment} loggedUser={this.props.loggedUser}/>
                    })
                }
            </div>
            
        )
    }
}
export default ArticleComments;