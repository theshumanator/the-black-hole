const axios = require( 'axios' );
const { BASE_URL, USERS_EP, ARTICLES_EP, TOPICS_EP, COMMENTS_EP } = require( '../utils/urls' );

const getUserDetails = ( username ) => {
    return axios.get( `${ BASE_URL }/${ USERS_EP }/${ username }` )
        .then( ( { data: { user } } ) => {
            return user;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const createNewUser = ( newUser ) => {
    return axios.post( `${ BASE_URL }/${ USERS_EP }`, newUser )
        .then( ( { data } ) => {
            return data;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const postNewArticle = ( newArticle ) => {
    return axios.post( `${ BASE_URL }/${ ARTICLES_EP }`, newArticle )
        .then( ( { data } ) => {
            return data;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const getAllArticles = ( requestedQuery ) => {        

    let url = `${ BASE_URL }/${ ARTICLES_EP }`;

    const possibleQueries = [ 'author', 'topic', 'sort_by', 'order', 'p' ];
    const queryClause = Object.keys( requestedQuery ).reduce( ( acc, key, idx ) => {
        if ( possibleQueries.includes( key ) ) {
            if ( idx !== 0 ) {
                acc += '&';
            }
            acc += `${ key }=${ requestedQuery[ key ] }`;            
        }
        return acc;
    },'' );

    if ( queryClause !== '' ) {
        url += `?${ queryClause }`;
    }
    
    //console.log( url );
    
    return axios.get( url )
        .then( ( { data } ) => {            
            return data;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const getArticleById = ( articleId ) => {
    return axios.get( `${ BASE_URL }/${ ARTICLES_EP }/${ articleId }` )
        .then( ( { data: { article } } ) => {
            return article;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const getAllTopics = ( ) => {
    return axios.get( `${ BASE_URL }/${ TOPICS_EP }` )
        .then( ( { data: { topics } } ) => {
            return topics;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const createNewTopic = ( newTopic ) => {
    return axios.post( `${ BASE_URL }/${ TOPICS_EP }`, newTopic )
        .then( ( { data } ) => {
            return data;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const createNewComment = ( articleId, newComment ) => {
    return axios.post( `${ BASE_URL }/${ ARTICLES_EP }/${ articleId }/${ COMMENTS_EP }`, newComment )
        .then( ( { data } ) => {
            return data;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const updateVote = ( articleId, vote ) => {
    return axios.patch( `${ BASE_URL }/${ ARTICLES_EP }/${ articleId }`, vote )
        .then( ( { data: { article } } ) => {
            return article;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const updateCommentVote = ( commentId, vote ) => {
    return axios.patch( `${ BASE_URL }/${ COMMENTS_EP }/${ commentId }`, vote )
        .then( ( { data: { comment } } ) => {
            return comment;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const getArticleComments = ( articleId, requestedQuery ) => {
    let url = `${ BASE_URL }/${ ARTICLES_EP }/${ articleId }/comments`;

    const possibleQueries = [ 'sort_by', 'order' , 'p' ];
    const queryClause = Object.keys( requestedQuery ).reduce( ( acc, key, idx ) => {
        if ( possibleQueries.includes( key ) ) {
            if ( idx !== 0 ) {
                acc += '&';
            }
            acc += `${ key }=${ requestedQuery[ key ] }`;            
        }
        return acc;
    },'' );

    if ( queryClause !== '' ) {
        url += `?${ queryClause }`;
    }
    console.log( url );
    return axios.get( url )
        .then( ( { data } ) => {
            return data;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const deleteArticle = ( articleId ) => {
    return axios.delete( `${ BASE_URL }/${ ARTICLES_EP }/${ articleId }` )
        .then( ( data ) => {
            return data.status;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const deleteComment = ( commentId ) => {
    return axios.delete( `${ BASE_URL }/${ COMMENTS_EP }/${ commentId }` )
        .then( ( { status } ) => {
            return status;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

module.exports = { getUserDetails, createNewUser, getAllArticles, getArticleById, createNewTopic, postNewArticle, getAllTopics, updateVote , getArticleComments, updateCommentVote, createNewComment, deleteArticle, deleteComment };
