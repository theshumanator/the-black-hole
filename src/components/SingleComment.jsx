import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import {updateCommentVote} from '../utils/APICalls';

class SingleComment extends Component {

    state = {
        comment: null
    }

    componentDidMount () {
        this.setState({comment: this.props.comment})
    }

    handleVote = (voteVal) => {                
        updateCommentVote(this.state.comment.comment_id, {inc_votes: voteVal})
            .then((comment) => { 
                this.setState({comment})
                 
            })
            .catch(error => console.log('got : ' + error))
    }


    render() {
        const {comment} = this.state;
        return (
            comment && <Card key={comment.comment_id}>                            
                <Card.Body>
                    <p>User: <span>{comment.author}</span></p>
                    <p>Date: <span>{comment.created_at}</span></p>
                    <p>{comment.body}</p>
                    <span>Rating: {comment.votes}</span>
                    <p>
                    <Button variant="outline-success" size="sm" onClick={()=>this.handleVote(1)}>Awesome</Button>
                        <span> What do you think of this comment? </span>
                    <Button variant="outline-danger" size="sm" onClick={()=>this.handleVote(-1)}>Boring</Button>
                    </p>
                </Card.Body>
            </Card>
        )
    }
}
export default SingleComment;