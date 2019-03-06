import { getAllArticles } from './APICalls';

const fetchArticles = ( p ) => {
    return getAllArticles( { p } )
        .then( ( { articles, total_count } ) => {
            return { articles, total_count };
        } )
        .catch( error => console.log( 'got : ' + error ) ); 
};

const getMostActive = () => {    
    const articlesArr = [];    
    let fetchMore = true;
    let page = 1;
    while ( fetchMore ) {
        const fetchedOutput = fetchArticles( page );
        articlesArr.push( ...fetchedOutput.articles );
        if ( articlesArr.length === fetchedOutput.total_count ) {
            fetchMore = false;
        } else {
            page++;
        }        
    }
    
    fetchMore = true;
    page = 1;
    while ( fetchMore ) {
        const fetchedOutput = fetchComments( page );
        articlesArr.push( ...fetchedOutput.articles );
        if ( articlesArr.length === fetchedOutput.total_count ) {
            fetchMore = false;
        } else {
            page++;
        }        
    }


    const usersWithMostArticles = articlesArr.reduce( ( acc, article ) => {
        const user = article[ 'author' ];
        if ( user in acc ) {
            acc[ user ]++;
        } else {
            acc[ user ] = 1;
        }
        return acc;
    }, {} );
    
    const usersWithMostComments = commentsArr.reduce( ( acc, comment ) => {
        const user = comment[ 'author' ];
        if ( user in acc ) {
            acc[ user ]++;
        } else {
            acc[ user ] = 1;
        }
        return acc;
    }, {} );

    const mostActiveUsers
    
    //mostActiveUsers.sort( ( { keyA, valA }, { keyB, valB } ) => valB - valA );
    
    //return articlesArr;
};

module.exports = { getMostActive };
