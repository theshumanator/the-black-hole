const axios = require( 'axios' );

const getUserDetails = ( username ) => {
    return axios.get( `https://shumanator-nc-knews.herokuapp.com/api/users/${ username }` )
        .then( ( { data: { user } } ) => {
            return user;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return null;
        } );
};

const createNewUser = ( newUser ) => {
    return axios.post( 'https://shumanator-nc-knews.herokuapp.com/api/users', newUser )
        .then( ( { data } ) => {
            return data;
        } )
        .catch( ( { response: { data } } ) => {               
            console.error( data );
            return data;
        } );
};

const getArticlesByUser = ( username ) => {
    return axios.get( `https://shumanator-nc-knews.herokuapp.com/api/articles?author=${ username }` )
        .then( ( { data: { articles } } ) => {
            return articles;
        } )
        .catch( ( { response: { data } } ) => {                           
            console.error( data );
            return data;
        } );
};

module.exports = { getUserDetails, createNewUser, getArticlesByUser };

/* 
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