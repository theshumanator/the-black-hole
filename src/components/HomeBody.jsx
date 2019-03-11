import React, { Component } from 'react';
import { navigate } from '@reach/router';
import { Row, Col, Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import TopicsDropdown from './TopicsDropdown';
import ArticleListItem from './ArticleListItem';
import { homeSortDropdowns } from '../utils/dropdowns';
import SortDropdown from './SortDropdown';
import LoggedInButtons from './LoggedInButtons';

class HomeBody extends Component {

    state = {
        hasMore: false,
        isLoading: true,
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        pageNum: 1, //default
        articles: [],
        topics: [],
        reQuery: false,
        reQueryTopics: false,
        showNewTopicModal: false,
        showNewArticleModal: false,
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

    /* 
        infinite scrolling - 2 scenarios to trigger fetch
        -scroll reaching bottom, load more if there is
        -once first batch loaded, if hasMore && .articlesList client height < docElement client Height load more
    */
    handleScroll = ( ) => {           
        const { hasMore, isLoading } = this.state;
        if ( hasMore && !isLoading ) {
            //compare the article list height/offset vs the entire window height/offset
            const lastArticleCard = document.querySelector( '.articleListItemCard:last-of-type' );           
            const lastArticleCardOffset = lastArticleCard.offsetTop + lastArticleCard.clientHeight;
            const pageOffset = window.pageYOffset + window.innerHeight;            
            if ( pageOffset > lastArticleCardOffset ) {                                      
                this.fetchArticles();
            }
        }        
    }

    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''            
        } );
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
        let { pageNum } = this.state;             
        const { sortByKey, sortOrder } = this.state;
        const params = { sort_by: sortByKey, order: sortOrder, p: pageNum } ;
        const apiObj = {
            url: '/articles',
            reqObjectKey: 'data',
            method: 'get',
            params,
            multiRes: true
        };

        this.setState( { isLoading: true }, () => {
            makeAPICalls( apiObj ) 
                .then ( ( { articles, total_count } ) => {
                    this.setState( {
                        hasMore: ( articles.length + this.state.articles.length ) < total_count,
                        isLoading: false,
                        articles: pageNum === 1 ? articles : [ ...this.state.articles, ...articles ],
                        pageNum: ++pageNum
                    } );
                } ) 
                .catch( () => {
                    this.setState( { hasMore: false, isLoading: false, articles: [], pageNum: --pageNum } );
                } );
        } );
        
    }

    componentDidUpdate ( ) {
        const { hasMore, isLoading, reQuery, reQueryTopics } = this.state;
        if ( reQuery ) {
            this.setState( { reQuery: false }, () => this.fetchArticles() ); 
        } else if ( reQueryTopics ) {
            this.setState( { reQueryTopics: false }, () => this.fetchTopics() );
        } else if ( !isLoading && hasMore && document.querySelector( '.articlesList' ) !== null ) {
            //scenario where we load 10 items but there is more space in the window so need to load more
            const docHeight = document.documentElement.clientHeight;
            const divHeight = document.querySelector( '.articlesList' ).clientHeight;
            if ( divHeight < docHeight ) {
                this.fetchArticles();
            }
        }            
    }

    componentDidMount () {             
        window.addEventListener( 'resize', this.handleScreenResize, false ); 
        window.addEventListener( 'scroll', this.handleScroll );        
        this.fetchArticles();
        this.fetchTopics();                    
        
    }

    render () {        
        const { isLoading , articles, hasMore, screenSize, showNewTopicModal, showNewArticleModal, topics } = this.state;  
        const loggedUser = this.props.loggedUser;        
        return (
            <div className="homeArticlesList">
                {            
                    //need to put condition for !hasMore to avoid it jumping back up upon each scroll     
                    isLoading && !hasMore
                        ? <h3>Loading...</h3>
                        : <div>  
                            <Row className="loggedInFuncsRow">
                                {
                                    loggedUser
                                        ? <LoggedInButtons screenSize={screenSize} handleShowNewTopic={this.handleShowNewTopic}
                                            showNewTopicModal={showNewTopicModal} handleNewTopicClose={this.handleNewTopicClose}
                                            handleShowNewArticle={this.handleShowNewArticle} handleNewArticleClose={this.handleNewArticleClose}
                                            showNewArticleModal={showNewArticleModal} />
                                        : <></>
                                }
                            </Row>
                            <Row className="sortFilterRow">
                                <TopicsDropdown size={screenSize} className="filterDropdown" topics={topics} handleFilterSelect={this.handleFilterSelect}/>                          
                                <Button size={screenSize} className="allUsersButton" variant="primary" href="/users">Show all users</Button>
                                <SortDropdown sortDropdowns={homeSortDropdowns} handleSortSelect={this.handleSortSelect} size={screenSize}/>                                                           
                            </Row>
                            <Row className="articleListRow">                        
                                <Col xs={9} className="articleListItem">                            
                                    {articles  
                                        ? <div className="articlesList">
                                            {articles.map( ( article, idx ) => {                       
                                                return <ArticleListItem key={idx} article={article} idx={idx}/>;
                                            } )}</div>
                                        : <h3 className="noResults">There are no articles in the black hole</h3>
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