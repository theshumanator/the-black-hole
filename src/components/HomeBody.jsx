import React, { Component, Fragment } from 'react';
import { navigate } from '@reach/router';
import { getAllArticles, getAllTopics } from '../utils/APICalls';
import { Row, Col, Button } from 'react-bootstrap';
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';
import TopicsDropdown from './TopicsDropdown';
import ArticleListItem from './ArticleListItem';
import { homeSortDropdowns } from '../utils/dropdowns';
import SortDropdown from './SortDropdown';

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
        this.setState( { showNewArticleModal: false, reQuery: true, articles: [], pageNum: 1 } );
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
        getAllTopics()
            .then( ( topics ) => {
                this.setState( { topics } );
            } )
            .catch( error => console.log( 'got : ' + error ) ); 
    }
    fetchArticles = () => {        
        let { pageNum, accumCount, prevClicked } = this.state;
        
        getAllArticles( { sort_by: this.state.sortByKey, order: this.state.sortOrder, p: pageNum } )
            .then( ( { articles, total_count } ) => {                        
                if ( !Array.isArray( articles ) ) {
                    this.setState( {
                        hasMore: false,                        
                        isLoading: false,
                        reQuery: false,
                        pageNum: --pageNum,
                        pageClicked: false,
                        //numOfPages: Math.floor(total_count/10)+1
                        prevClicked: true
                    } );
                } else {
                    //console.log('accum count' + accumCount + ' with length: ' + articles.length)
                    //only chnaging it if it wasnt the prev clicked
                    if ( !prevClicked ) {
                        accumCount += articles.length;
                    }
                        
                    //console.log('New accum count' + accumCount)
                    this.setState( {
                        //hasMore: ((this.state.articles.length + articles.length)<total_count),         
                        hasMore: ( ( accumCount + articles.length ) < total_count ),         
                        isLoading: false,
                        //articles: pageNum!==1?[...this.state.articles, ...articles]:articles,
                        articles,
                        reQuery: false,
                        pageClicked: false,
                        //numOfPages: Math.floor(total_count/10)+1,
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: true
                    } );
                }
                    
            } )
            .catch( error => console.log( 'got : ' + error ) );             
    }

    handlePageClick = ( pageOffset ) => {        
        this.setState( ( { pageNum, accumCount, pageClicked, articles } ) => ( {
            pageNum: pageNum + pageOffset,
            pageClicked: true,
            prevClicked: pageOffset === -1,
            accumCount: pageOffset === -1 ? accumCount - articles.length : accumCount
        } ) );
    }

    render() {
        const articleArr = this.state.articles;   
        const { isLoading , accumCount, pageNum, totalCount, screenSize } = this.state;     
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
                                        ? <Fragment>
                                            <Button size={screenSize} variant="primary" onClick={this.handleShowNewTopic}>Create a new topic</Button>
                                            {
                                                this.state.showNewTopicModal && <NewTopicForm
                                                    showNewTopicModal={this.state.showNewTopicModal}
                                                    handleNewTopicClose={this.handleNewTopicClose}
                                                    size={screenSize}
                                                />
                                            }
                                    
                                            <Button size={screenSize} variant="primary" onClick={this.handleShowNewArticle}>Create a new article</Button>
                                            {
                                                this.state.showNewArticleModal && <NewArticleForm
                                                    showNewArticleModal={this.state.showNewArticleModal}
                                                    handleNewArticleClose={this.handleNewArticleClose}
                                                    size={screenSize}/>
                                            }
                                        </Fragment>
                                        : <Fragment/>
                                }
                            </Row>
                            <Row className="sortFilterRow">
                                <TopicsDropdown size={screenSize} className="filterDropdown" topics={this.state.topics} handleFilterSelect={this.handleFilterSelect}/>                          
                                <Button size={screenSize} className="allUsersButton" variant="primary" href="/users">Show all users</Button>
                                <SortDropdown sortDropdowns={homeSortDropdowns} handleSortSelect={this.handleSortSelect} size={screenSize}/>                                                           
                            </Row>

                            <Row className="browseFuncsRow">     
                                <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => this.handlePageClick( -1 )} variant="outline-primary" disabled={pageNum === 1 || articleArr.length === 0}>Previous</Button>                          
                                <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => this.handlePageClick( 1 )} variant="outline-primary" disabled={accumCount === totalCount}>Next</Button>                       
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
