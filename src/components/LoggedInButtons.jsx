import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';

const LoggedInButtons = ( { screenSize, handleShowNewTopic, showNewTopicModal, handleNewTopicClose, 
    handleShowNewArticle, showNewArticleModal, handleNewArticleClose } ) => {
    return (
        <Fragment>
            <Button data-cy="cyCreateTopic" size={screenSize} variant="primary" onClick={handleShowNewTopic}>Create a new topic</Button>
            {
                showNewTopicModal && <NewTopicForm showNewTopicModal={showNewTopicModal} 
                    handleNewTopicClose={handleNewTopicClose} size={screenSize}/>
            }                                    
            <Button data-cy="cyCreateArticle" size={screenSize} variant="primary" onClick={handleShowNewArticle}>Create a new article</Button>
            {
                showNewArticleModal && <NewArticleForm showNewArticleModal={showNewArticleModal}
                    handleNewArticleClose={handleNewArticleClose} size={screenSize}/>
            }
        </Fragment>
        
    );
};

LoggedInButtons.propTypes = {
    handleShowNewTopic: PropTypes.func,
    handleNewTopicClose: PropTypes.func,
    handleShowNewArticle: PropTypes.func,
    handleNewArticleClose: PropTypes.func,
    showNewTopicModal: PropTypes.bool,
    showNewArticleModal: PropTypes.bool,    
    screenSize: PropTypes.string
};

export default LoggedInButtons;