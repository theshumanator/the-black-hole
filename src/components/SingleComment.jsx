import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import {updateCommentVote, deleteComment} from '../utils/APICalls';

class SingleComment extends Component {

    state = {
        comment: null,
        userVoted: false,        
    }

    componentDidMount () {
        this.setState({comment: this.props.comment})
    }

    handleVote = (voteVal) => {                
        updateCommentVote(this.state.comment.comment_id, {inc_votes: voteVal})
            .then((comment) => { 
                this.setState({comment, userVoted: true})
                 
            })
            .catch(error => console.log('got : ' + error))
    }

    handleDelete = () => {
        deleteComment(this.state.comment.comment_id)
            .then((status) => {
                if(status===204) {
                    this.setState({comment: null}, () => this.props.handleDeleteDone())                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    render() {
        const {comment, userVoted} = this.state;        
        return (
            comment && <Card key={comment.comment_id}>                            
                <Card.Body>
                    <p>User: <span>{comment.author}</span></p>
                    <p>Date: <span>{comment.created_at}</span></p>
                    <p>{comment.body}</p>
                    <span>Rating: {comment.votes}</span>
                    <p>
                    <Button disabled={userVoted} variant="outline-success" size="sm" onClick={()=>this.handleVote(1)}>Awesome</Button>
                        <span> What do you think of this comment? </span>
                    <Button disabled={userVoted} variant="outline-danger" size="sm" onClick={()=>this.handleVote(-1)}>Boring</Button>
                    </p>
                    <p>
                        {
                            this.props.loggedUser === comment.author && <Button variant="danger" size="sm" onClick={this.handleDelete}>Delete my comment</Button>
                        }
                    </p>
                </Card.Body>
            </Card>
        )
    }
}
export default SingleComment;