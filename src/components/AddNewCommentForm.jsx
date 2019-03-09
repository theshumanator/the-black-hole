import React from 'react';
import AddNewComment from './AddNewComment';

const AddNewCommentForm = ( { showNewCommentModal, loggedUser, articleId, handleNewCommentClose } ) => {
    return (
        showNewCommentModal && loggedUser && <AddNewComment articleId={articleId} loggedUser={loggedUser} 
            showNewCommentModal={showNewCommentModal} handleNewCommentClose={handleNewCommentClose}/>
    );
};
export default AddNewCommentForm;
