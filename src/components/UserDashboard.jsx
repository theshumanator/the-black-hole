import React, { Component } from 'react';
import { makeAPICalls } from '../utils/APICalls';
import BreadCrumb from './BreadCrumb';
import SingleUserCard from './SingleUserCard';
import UserDashboardArticleList from './UserDashboardArticleList';
import { shouldScroll, hasSpaceForMore } from '../utils/infiniteScroll';
import { throttle } from 'lodash';
import axios from 'axios';

class UserDashboard extends Component {

    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    _isMounted = false;

    state = {
        requestedUser: null,
        userStr: '',
        articles: [],
        articlesFound: false,        
        hasMore: false,
        isLoading: true,        
        pageNum: 1, //default        
        screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
    }
    componentDidMount () {
        this._isMounted = true;     
        window.addEventListener( 'resize', this.handleScreenResize, false );
        window.addEventListener( 'scroll', this.handleScroll );        
        this.fetchUserDetails( );
        this.fetchArticles();
    }

    componentDidUpdate ( ) {       
        const { isLoading, hasMore } = this.state;       
        if ( !isLoading && hasMore && document.querySelector( '.articlesList' ) !== null ) {
            //scenario where we load the first batch but there is more space in the window so need to load more
            if ( hasSpaceForMore( '.articlesList' ) ) {
                this.fetchArticles();
            }
        }

    }

    componentWillUnmount () {        
        this.source.cancel( 'Api is being canceled' );
        window.removeEventListener( 'resize', this.handleScreenResize, false ); 
        window.removeEventListener( 'scroll', this.handleScroll );        
        this._isMounted = false;
    }

    handleScroll = throttle( ( ) => {           
        const { hasMore, isLoading } = this.state;
        if ( hasMore && !isLoading && shouldScroll( '.articlesList' ) ) {
            this.fetchArticles();
        }        
    }, 500 );
    
    fetchUserDetails = ( ) => {   
        const { username } = this.props;  
        const apiObj = {
            url: `/users/${ username }`,
            reqObjectKey: 'user',
            method: 'get'
        };
        this._isMounted && makeAPICalls( apiObj )
            .then( ( user ) => {                
                this.setState( { userStr: JSON.stringify( user ) } );
            } )
            .catch( ( err ) => {
                if ( !axios.isCancel( err ) ) {
                    this.setState( { userStr: '' } );
                }
            } );
    }

    handleScreenResize = () => {                
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
        } );
    }

    fetchArticles () {
        let { pageNum } = this.state;             
        const { username } = this.props;
        const params = { author: username, p: pageNum };
        const apiObj = {
            url: '/articles',
            reqObjectKey: 'data',
            method: 'get',
            params,
            cancelToken: this.source.token,
            multiRes: true
        };

        this._isMounted && this.setState( { isLoading: true }, () => {
            makeAPICalls( apiObj ) 
                .then ( ( { articles, total_count } ) => {
                    const morePendingRecords = ( articles.length + this.state.articles.length ) < total_count;
                    this.setState( {
                        hasMore: morePendingRecords,
                        isLoading: false,
                        articles: pageNum === 1 ? articles : [ ...this.state.articles, ...articles ],
                        pageNum: morePendingRecords ? ++pageNum : pageNum,
                        requestedUser: username,
                        articlesFound: true
                    } );
                } ) 
                .catch( ( err ) => {
                    if ( !axios.isCancel( err ) ) {
                        this.setState( { 
                            hasMore: false, 
                            isLoading: false, 
                            articles: pageNum === 1 ? [] : this.state.articles, 
                            pageNum: pageNum > 1 ? --pageNum : pageNum, 
                            requestedUser: username, 
                            articlesFound: false } );
                    }                     
                } );
        } );
    }

    handleDelete = ( articleId ) => {           
        const apiObj = {
            url: `/articles/${ articleId }`,
            reqObjectKey: 'status',
            method: 'delete'            
        };
        this._isMounted && makeAPICalls( apiObj )
            .then( ( status ) => {
                if ( status === 204 ) {
                    const { articles } = this.state;
                    const updatedArticles = articles.filter( ( article ) => article.article_id !== articleId );    
                    this.setState( { articles: updatedArticles } );                    
                }
            } )
            .catch();
    }

    render() {        
        const { username, loggedUser } = this.props;
        //const articleArr = this.state.articles;
        const { articlesFound, pageNum, accumCount, totalCount, isLoading, screenSize, userStr,articles, hasMore } = this.state;  
        const user = userStr === '' ? {} : JSON.parse( userStr );
        const articleProps = { articlesFound, username, screenSize, pageNum, articles, accumCount, totalCount, 
            userStr, loggedUser };
        return (
            <div className="articlesList">
                <BreadCrumb currentPage={`User dashboard: ${ username }`}/>
                {userStr
                    ? <SingleUserCard user={user}/>
                    : <h3 className="noResults">Username {username} does not exist.</h3>                 
                }
                {
                    isLoading && !hasMore
                        ? <h3>Loading...</h3>
                        : <UserDashboardArticleList articleProps={articleProps} handleDelete={this.handleDelete} 
                            handlePageClick={this.handlePageClick}/> 
                }                                      
            </div>
        );
    }
}
export default UserDashboard;
