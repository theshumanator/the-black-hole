import React, {Fragment} from 'react';
import {Button} from 'react-bootstrap';

const VotingButtons = ( {size, handleVote, upVote, downVote, userVoted} ) => {
    return (
        <Fragment>
            <Button size={size} disabled={userVoted} variant="outline-success" className = "commentLikeButton" onClick={()=>handleVote(1)}>{upVote}</Button> 
            <Button size={size} disabled={userVoted} variant="outline-danger" className = "prevNextGap commentLikeButton" onClick={()=>handleVote(-1)}>{downVote}</Button>
        </Fragment>     
    ) ;   
};

export default VotingButtons;