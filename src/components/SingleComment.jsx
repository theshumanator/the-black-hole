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
        console.log('component did mount')
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
        console.log('render')
        const { userVoted} = this.state;  
        const {comment} = this.props
        
        return (
            comment && <Card key={comment.comment_id} className="singleCommentItem">                            
                <Card.Body>
                    <p className="commentTitle">{comment.author} comment on this <PrettyDate dateType="fromNow" created_at={comment.created_at}/>: </p>                    
                    <p className="commentBody">{comment.body}</p>
                    <p><span className="likesItem">(Dis)Likes: </span><span>{userVoted && this.state.comment?this.state.comment.votes:comment.votes}</span></p>                    
                     <p>
                    <Button disabled={userVoted} variant="outline-success" size="sm" onClick={()=>this.handleVote(1)}>I agree with it</Button>
                    <span> What do you think of this comment? </span>
                    <Button disabled={userVoted} variant="outline-danger" size="sm" onClick={()=>this.handleVote(-1)}>It is infuriating</Button>
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