import React, { Component } from 'react';
import { makeAPICalls } from '../utils/APICalls';
import BreadCrumb from './BreadCrumb';
import SingleUserCard from './SingleUserCard';
import UserDashboardArticleList from './UserDashboardArticleList';

class UserDashboard extends Component {

    state = {
        requestedUser: null,
        userStr: '',
        articles: [],
        articlesFound: false,
        error: false,
        hasMore: true,
        isLoading: true,
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false,
        pageNum: 1, //default
        articleDeleted: false,
        screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
    }
    componentDidMount () {
        window.addEventListener( 'resize', this.handleScreenResize, false );
        this.fetchUserDetails( );
        this.fetchArticles();
    }

    componentDidUpdate ( prevProps, prevState ) {
        const { pageNum } = this.state;   
        const { requestedUser, pageClicked, articleDeleted, screenSize } = this.state;       
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasScreenChanged = prevState.screenSize !== screenSize;
        const hasUserChanged = requestedUser !== this.props.username;        
        if ( hasUserChanged ) {                        
            if ( pageNum === 1 ){
                this.fetchArticles();
            } else {
                this.setState( { pageNum: 1 } );                
            }                         
        } 
        if ( hasPageChanged && pageClicked ) {
            this.fetchArticles();
        } 

        if ( articleDeleted || hasScreenChanged ) {
            this.fetchArticles();
        }
    }

    fetchUserDetails = ( ) => {   
        const { username } = this.props;  
        const apiObj = {
            url: `/users/${ username }`,
            reqObjectKey: 'user',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( ( user ) => {                
                this.setState( { userStr: JSON.stringify( user ) } );
            } )
            .catch( () => this.setState( { userStr: '' } ) );
    }

    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
        } );
    }

    fetchArticles () {
        let { pageNum, accumCount, prevClicked } = this.state;
        const { username } = this.props;
        const params = { author: username, p: pageNum };
        const apiObj = {
            url: '/articles',
            reqObjectKey: 'data',
            method: 'get',
            params,
            multiRes: true
        };

        makeAPICalls( apiObj )
            .then( ( { articles, total_count } ) => {
                if ( !Array.isArray( articles ) ) {                    
                    this.setState( {
                        hasMore: false,                        
                        isLoading: false,
                        pageClicked: pageNum > 1 ? true : false,
                        pageNum: pageNum > 1 ? --pageNum : 1,    
                        requestedUser: username,                         
                        prevClicked: true,
                        articlesFound: false,
                        articleDeleted: false
                    } );
                } else {
                    if ( pageNum === 1 ) {
                        accumCount = articles.length;
                    } else if ( !prevClicked ) {
                        accumCount += articles.length;
                    }
                    this.setState( {                        
                        hasMore: ( ( this.state.articles.length + articles.length ) < total_count ),
                        isLoading: false,                        
                        articles,
                        requestedUser: username,
                        articlesFound: true,
                        pageClicked: false,
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: false,
                        articleDeleted: false
                    } );
                } 
            } )
            .catch( ( ) => {
                this.setState( {
                    hasMore: false,                        
                    isLoading: false,
                    pageClicked: pageNum > 1 ? true : false,
                    pageNum: pageNum > 1 ? --pageNum : 1,    
                    requestedUser: username,                         
                    prevClicked: true,
                    articlesFound: false,
                    articleDeleted: false
                } );
            } ); 
    }

    handleDelete = ( articleId ) => {                          
        const apiObj = {
            url: `/articles/${ articleId }`,
            reqObjectKey: 'status',
            method: 'delete'            
        };
        makeAPICalls( apiObj )
            .then( ( status ) => {
                if ( status === 204 ) {
                    this.setState( ( { totalCount, accumCount } ) => ( {
                        totalCount: --totalCount,                                                
                        accumCount: --accumCount,
                        articleDeleted: true
                    } ) );                    
                }
            } )
            .catch( () => this.setState( { articleDeleted: false } ) );
    }

    handlePageClick = ( pageOffset ) => {        
        this.setState( ( { pageNum, accumCount, articles } ) => ( {
            pageNum: pageNum + pageOffset,
            pageClicked: true,
            prevClicked: pageOffset === -1,
            accumCount: pageOffset === -1 ? accumCount - articles.length : accumCount
        } ) );
    }

    render() {        
        const { username, loggedUser } = this.props;
        const articleArr = this.state.articles;
        const { articlesFound, pageNum, accumCount, totalCount, isLoading, screenSize, userStr } = this.state;  
        const user = userStr === '' ? {} : JSON.parse( userStr );
        const articleProps = { articlesFound, username, screenSize, pageNum, articleArr, accumCount, totalCount, 
            userStr, loggedUser };
        return (
            <div className="articlesList">
                <BreadCrumb currentPage={`User dashboard: ${ username }`}/>
                {userStr
                    ? <SingleUserCard user={user}/>
                    : <h3 className="noResults">Username {username} does not exist.</h3>                 
                }
                {
                    isLoading
                        ? <h3>Loading...</h3>
                        : <UserDashboardArticleList articleProps={articleProps} handleDelete={this.handleDelete} 
                            handlePageClick={this.handlePageClick}/> 
                }                                      
            </div>
        );
    }
}
export default UserDashboard;
