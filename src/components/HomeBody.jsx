import React, { Component, Fragment } from 'react';
import { navigate } from '@reach/router';
import { makeAPICalls } from '../utils/APICalls';
import { Row, Col, Button } from 'react-bootstrap';
import TopicsDropdown from './TopicsDropdown';
import ArticleListItem from './ArticleListItem';
import { homeSortDropdowns } from '../utils/dropdowns';
import SortDropdown from './SortDropdown';
import LoggedInButtons from './LoggedInButtons';

class HomeBody extends Component {
      
    state = {
        error: false,
        hasMore: true,
        isLoading: true,
        articles: [],
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        pageNum: 1, //default
        reQuery: false,
        reQueryTopics: false,
        showNewTopicModal: false,
        showNewArticleModal: false,
        topics: [],
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false,
        screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
    };

    handleFilterSelect = ( eventKey ) => {
        navigate( `/topics/${ eventKey }` );        
    }

    handleSortSelect = ( eventKey ) => {
        const sortArr = eventKey.split( ' ' );
        this.setState( { sortByKey: sortArr[ 0 ], sortOrder: sortArr[ 1 ], reQuery: true, articles: [], pageNum: 1 } );
    }

    handleShowNewTopic = () => {
        this.setState( { showNewTopicModal: true, reQuery: false } );
    }

    handleNewTopicClose = () => {
        this.setState( { showNewTopicModal: false, reQuery: false, reQueryTopics: true } );
    } 

    handleShowNewArticle = () => {
        this.setState( { showNewArticleModal: true, reQuery: false } );
    }

    handleNewArticleClose = () => {
        this.setState( { showNewArticleModal: false, reQuery: true, reQueryTopics: true, articles: [], pageNum: 1 } );
    } 
       
    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''            
        } );
    }
    componentDidMount () {         
        window.addEventListener( 'resize', this.handleScreenResize, false );
        this.fetchArticles();
        this.fetchTopics();                    
    }
    
    componentDidUpdate ( prevProps, prevState ) {   
        const { reQuery, pageNum, pageClicked, reQueryTopics } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        if ( reQuery ) {
            this.setState( { pageNum: 1, reQuery: false }, () => this.fetchArticles() );
        } 
        if ( reQueryTopics ) {
            this.setState( { reQueryTopics: false }, () => this.fetchTopics() );
        }
        if ( hasPageChanged && pageClicked ) {
            this.fetchArticles();
        }
    }

    fetchTopics () {
        const apiObj = {
            url: '/topics/',
            reqObjectKey: 'topics',
            method: 'get'
        };
        makeAPICalls( apiObj )
            .then( ( topics ) => {
                this.setState( { topics } );
            } )
            .catch( ( ) => this.setState( { topics: [] } ) ); 
    }
    fetchArticles = () => {        
        let { pageNum, accumCount, prevClicked } = this.state;
        const { sortByKey, sortOrder } = this.state;
        const params = { sort_by: sortByKey, order: sortOrder, p: pageNum } ;
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
                        reQuery: false,
                        pageNum: --pageNum,
                        pageClicked: false,
                        prevClicked: true
                    } );
                } else {                                                             
                    if ( pageNum === 1 ) {
                        accumCount = articles.length;
                    } else if ( !prevClicked ) {
                        accumCount += articles.length;
                    }
                    this.setState( {                        
                        hasMore: ( ( accumCount + articles.length ) < total_count ),         
                        isLoading: false,                        
                        articles,
                        reQuery: false,
                        pageClicked: false,                        
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: false 
                    } );
                }
                    
            } )
            .catch( ( ) => {
                this.setState( {
                    hasMore: false,                        
                    isLoading: false,
                    reQuery: false,
                    pageNum: --pageNum,
                    pageClicked: false,
                    prevClicked: true
                } );
            } );             
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
        const articleArr = this.state.articles;   
        const { isLoading , accumCount, pageNum, totalCount, screenSize, showNewTopicModal, showNewArticleModal, topics } = this.state;     
        const loggedUser = this.props.loggedUser;        
        return (    
            <div className="homeArticlesList">
                {                 
                    isLoading
                        ? <h3>Loading...</h3>
                        : <div>  
                            <Row className="loggedInFuncsRow">
                                {
                                    loggedUser
                                        ? <LoggedInButtons screenSize={screenSize} handleShowNewTopic={this.handleShowNewTopic}
                                            showNewTopicModal={showNewTopicModal} handleNewTopicClose={this.handleNewTopicClose}
                                            handleShowNewArticle={this.handleShowNewArticle} handleNewArticleClose={this.handleNewArticleClose}
                                            showNewArticleModal={showNewArticleModal} />
                                        : <Fragment/>
                                }
                            </Row>
                            <Row className="sortFilterRow">
                                <TopicsDropdown size={screenSize} className="filterDropdown" topics={topics} handleFilterSelect={this.handleFilterSelect}/>                          
                                <Button size={screenSize} className="allUsersButton" variant="primary" href="/users">Show all users</Button>
                                <SortDropdown sortDropdowns={homeSortDropdowns} handleSortSelect={this.handleSortSelect} size={screenSize}/>                                                           
                            </Row>
                            <Row className="browseFuncsRow">     
                                <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => this.handlePageClick( -1 )} 
                                    variant="outline-primary" disabled={pageNum === 1 || articleArr.length === 0}>Previous</Button>                          
                                <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => this.handlePageClick( 1 )} 
                                    variant="outline-primary" disabled={accumCount === totalCount}>Next</Button>                       
                            </Row>
                            <Row className="articleListRow">                        
                                <Col xs={9} className="articleListItem">                            
                                    {articleArr && <div className="articlesList">
                                        {articleArr.map( ( article, idx ) => {                       
                                            return <ArticleListItem key={idx} article={article} idx={idx}/>;
                                        } )}</div>
                                    } 
                                </Col>
                            </Row> 
                        </div>
                }
            </div>
        );
    }
}

export default HomeBody;
