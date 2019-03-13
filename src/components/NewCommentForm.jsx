import React from 'react';
import NewCommentModal from './NewCommentModal';

const NewCommentForm = ( { showNewCommentModal, loggedUser, articleId, handleNewCommentClose } ) => {
    return (
        showNewCommentModal && loggedUser && <NewCommentModal articleId={articleId} loggedUser={loggedUser} 
            showNewCommentModal={showNewCommentModal} handleNewCommentClose={handleNewCommentClose}/>
    );
};
export default NewCommentForm;
