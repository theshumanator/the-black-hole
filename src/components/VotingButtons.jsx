import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const VotingButtons = ( { size, handleVote, upVote, downVote, userVoted } ) => {
    return (
        <Fragment>
            <Button data-cy="cyUpVote" size={size} disabled={userVoted} variant="outline-success" className = "commentLikeButton" onClick={() => handleVote( 1 )}>{upVote}</Button> 
            <Button data-cy="cyDowVote" size={size} disabled={userVoted} variant="outline-danger" className = "prevNextGap commentLikeButton" onClick={() => handleVote( -1 )}>{downVote}</Button>
        </Fragment>     
    ) ;   
};

VotingButtons.propTypes = {
    handleVote: PropTypes.func,
    userVoted: PropTypes.bool,
    upVote: PropTypes.string,
    downVote: PropTypes.string,
    size: PropTypes.string,    
};

export default VotingButtons;