import React, { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';

const LoggedInButtons = ( { screenSize, handleShowNewTopic, showNewTopicModal, handleNewTopicClose, 
    handleShowNewArticle, showNewArticleModal, handleNewArticleClose } ) => {
    return (
        <Fragment>
            <Button size={screenSize} variant="primary" onClick={handleShowNewTopic}>Create a new topic</Button>
            {
                showNewTopicModal && <NewTopicForm showNewTopicModal={showNewTopicModal} 
                    handleNewTopicClose={handleNewTopicClose} size={screenSize}/>
            }                                    
            <Button size={screenSize} variant="primary" onClick={handleShowNewArticle}>Create a new article</Button>
            {
                showNewArticleModal && <NewArticleForm showNewArticleModal={showNewArticleModal}
                    handleNewArticleClose={handleNewArticleClose} size={screenSize}/>
            }
        </Fragment>
        
    );
};

export default LoggedInButtons;