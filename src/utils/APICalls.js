const axios = require( 'axios' );
const { BASE_URL, USERS_EP, ARTICLES_EP, TOPICS_EP, COMMENTS_EP } = require( '../utils/urls' );

const getUserDetails = ( username ) => {
    return axios.get( `${ BASE_URL }/${ USERS_EP }/${ username }` )
        .then( ( { data: { user } } ) => {
            return user;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return null;
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

    const possibleQueries = [ 'author', 'topic', 'sort_by', 'order' ];
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
    
    return axios.get( url )
        .then( ( { data: { articles } } ) => {
            return articles;
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

    const possibleQueries = [ 'sort_by', 'order' ];
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
    return axios.get( url )
        .then( ( { data: { comments } } ) => {
            return comments;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

const deleteArticle = ( articleId ) => {
    return axios.delete( `${ BASE_URL }/${ ARTICLES_EP }/${ articleId }` )
        .then( ( { status } ) => {
            return status;
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

/* 
getArticlesByUser
`
http://localhost:3000/
GET /api/topics
POST /api/topics

GET /api/articles
POST /api/articles

GET /api/articles/:article_id
PATCH /api/articles/:article_id
DELETE /api/articles/:article_id

GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api/users

Done:
GET /api/users/:username
POST /api/users

No need:
GET /api
*/