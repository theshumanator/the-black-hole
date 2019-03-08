import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import {updateCommentVote, deleteComment} from '../utils/APICalls';
import PrettyDate from './PrettyDate';

class SingleComment extends Component {

    state = {
        comment: null,
        userVoted: false
    }

    componentDidMount() {        
        this.setState({comment: this.props.comment})
    }


    handleVote = (voteVal) => {                        
        updateCommentVote(this.props.comment.comment_id, {inc_votes: voteVal})
            .then((comment) => { 
                this.setState({comment, userVoted: true})
                 
            })
            .catch(error => console.log('got : ' + error))
    }

    handleDelete = () => {        
        deleteComment(this.props.comment.comment_id)
            .then((status) => {
                if(status===204) {
                    this.setState({comment: null}, () => this.props.handleDeleteDone())                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    render() {        
        const { userVoted} = this.state;  
        const {comment, size} = this.props
        
        return (
            comment && <Card key={comment.comment_id} className="singleCommentItem">                            
                <Card.Body>
                    <p className="commentTitle">{comment.author} comment on this <PrettyDate dateType="fromNow" created_at={comment.created_at}/>: </p>                    
                    <p className="commentBody">{comment.body}</p>
                    <p><span className="likesItem">(Dis)Likes: </span><span>{userVoted && this.state.comment?this.state.comment.votes:comment.votes}</span></p>                    
                     <p>
                    <Button size={size} disabled={userVoted} variant="outline-success" className = "commentLikeButton" onClick={()=>this.handleVote(1)}>Agree</Button>                    
                    <Button size={size} disabled={userVoted} variant="outline-danger" className = "prevNextGap commentLikeButton" onClick={()=>this.handleVote(-1)}>Infuriating</Button>
                    </p>
                    <p>
                        {
                            this.props.loggedUser === comment.author && <Button size={size} variant="danger" onClick={this.handleDelete}>Delete my comment</Button>
                        }
                    </p>
                </Card.Body>
            </Card>
        )
    }
}
export default SingleComment;