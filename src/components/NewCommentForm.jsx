import React from 'react';
import AddNewCommentModal from './NewCommentModal';

const NewCommentForm = ( { showNewCommentModal, loggedUser, articleId, handleNewCommentClose } ) => {
    return (
        showNewCommentModal && loggedUser && <AddNewCommentModal articleId={articleId} loggedUser={loggedUser} 
            showNewCommentModal={showNewCommentModal} handleNewCommentClose={handleNewCommentClose}/>
    );
};
export default NewCommentForm;
