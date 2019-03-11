import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import PrettyDate from './PrettyDate';
import VotingButtons from './VotingButtons';
import axios from 'axios';

class SingleComment extends Component {

    //avoid memory leak cancel all axios requests, etc
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
    _isMounted = false;
    
    state = {
        comment: null,
        userVoted: false,
        deleteError: false
    }

    componentWillUnmount(){
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        this._isMounted = false;
    }
    componentDidMount() {     
        this._isMounted = true;           
        this.setState( { comment: this.props.comment } );
    }

    componentDidUpdate ( prevProps ) {
        if ( prevProps.loggedUser !== this.props.loggedUser ) {
            this.setState( { userVoted: false } );
        }
    }

    handleVote = ( voteVal ) => {  
        const data = { inc_votes: voteVal };
        const { comment_id } = this.props.comment;
        const apiObj = {
            url: `/comments/${ comment_id }`,
            reqObjectKey: 'comment',
            method: 'patch',
            data,
            cancelToken: this.source.token
        };

        this._isMounted && makeAPICalls( apiObj )
            .then( ( comment ) => this.setState( { comment, userVoted: true, deleteError: false } ) )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { comment: null, userVoted: false, deleteError: false } );
                }
            } );
    }

    handleDelete = () => {     
        const { comment_id } = this.props.comment;   
        const apiObj = {
            url: `/comments/${ comment_id }`,
            reqObjectKey: 'status',
            method: 'delete' ,       
            cancelToken: this.source.token   
        };
        this._isMounted && makeAPICalls( apiObj )
            .then( ( status ) => {
                if ( status === 204 ) {
                    this.setState( { comment: null, deleteError: false }, () => this.props.handleDeleteDone() );                    
                }
            } )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { comment: null, deleteError: true }, () => this.props.handleDeleteDone() );
                }
            } );
    }

    render() {        
        const { userVoted, deleteError } = this.state;  
        const { comment, size, loggedUser } = this.props;        
        const isUserAuthor = loggedUser === comment.author;
        const voteCount = userVoted && this.state.comment ? this.state.comment.votes : comment.votes;        
        
        return (
            comment && <Card key={comment.comment_id} className="singleCommentItem">                            
                <Card.Body>
                    <p className="commentTitle">{comment.author} comment on this <PrettyDate dateType="fromNow" created_at={comment.created_at}/>: </p>                    
                    <p className="commentBody">{comment.body}</p>
                    <p><span className="likesItem">(Dis)Likes: </span><span>{voteCount}</span></p>                    
                    <p>
                        {loggedUser && <VotingButtons size={size} userVoted={userVoted} upVote="Agree" downVote="Infuriating" handleVote={this.handleVote}/>}    
                    </p>
                    <p>
                        {
                            isUserAuthor && <Button size={size} variant="danger" onClick={this.handleDelete}>Delete my comment</Button>                            
                        }
                        {
                            deleteError && <span>Comment could not be deleted</span>
                        }
                    </p>
                </Card.Body>
            </Card>
        );
    }
}
export default SingleComment;