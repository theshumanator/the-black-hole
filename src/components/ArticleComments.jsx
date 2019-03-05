import React, { Component, Fragment } from 'react';
import {Card, Button} from 'react-bootstrap';
import {getArticleComments, updateCommentVote} from '../utils/APICalls'
import SingleComment from './SingleComment';
class ArticleComments extends Component {

    state = {
        comments: []    
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
        const {article} = this.props;
        const {comments} = this.state;
        
        return (
            <div>
                <p>Comments: {article.comment_count}</p>
                <Button variant="outline-primary" size="sm">Add a Comment</Button>
                {
                    comments && comments.map((comment) => {
                       return <SingleComment key={comment.comment_id} articleId={article.article_id} comment={comment}/>
                    })
                }
            </div>
            
        )
    }
}
export default ArticleComments;