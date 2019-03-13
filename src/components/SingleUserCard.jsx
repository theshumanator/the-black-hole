import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

const handleError = ( e ) => {
    e.target.alt = 'User image not available';
};

const SingleUserCard = ( { user } ) => {
    return (
        <div className="userCardDiv">
            <Card className="userCard">
                <Card.Img variant="top" src={user.avatar_url} alt="user image" onError={handleError}/>
                <Card.Body>
                    <Card.Title>Name: {user.name}</Card.Title>
                    <Card.Text> Username: {user.username}</Card.Text>                
                </Card.Body>
            </Card>
        </div>
        
    );
};

SingleUserCard.propTypes = {
    user: PropTypes.object,
};
export default SingleUserCard;
