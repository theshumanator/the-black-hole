import React, { Component } from 'react';
import { makeAPICalls } from '../utils/APICalls';
import { Button, Col, Row } from 'react-bootstrap';
import ArticleListItem from './ArticleListItem';
import BreadCrumb from './BreadCrumb';

class SingleTopic extends Component {
    state = {
        topic: null,
        articles: [],
        articlesFound: true,
        error: false,
        hasMore: true,
        isLoading: true,
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false,
        pageNum: 1, //default
        screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
    }

    componentDidMount () {
        window.addEventListener( 'resize', this.handleScreenResize, false );
        this.fetchArticles();
    }

    componentDidUpdate( prevProps, prevState ) {        
        const { pageNum, topic, pageClicked,screenSize } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasScreenChanged = prevState.screenSize !== screenSize;
        const hasTopicChanged = topic !== this.props.slug;
         
        if ( hasTopicChanged && topic !== null ) {            
            if ( pageNum === 1 ) {
                this.fetchArticles();
            } else {
                this.setState( { pageNum: 1 } );
            }            
        }
        if ( ( hasPageChanged && pageClicked ) || hasScreenChanged ) {
            this.fetchArticles();
        }       
    }

    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
        } );
    }

    fetchArticles = () => {
        let { pageNum, accumCount, prevClicked } = this.state;
        const { slug } = this.props;
        const params = { topic: slug, p: pageNum };
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
                        isLoading: false,
                        hasMore: false,
                        topic: slug,
                        pageClicked: false,
                        prevClicked: true,
                        articlesFound: false } );
                } else {
                    if ( !prevClicked ) {
                        accumCount += articles.length;
                    }
                    this.setState( {
                        hasMore: ( ( accumCount + articles.length ) < total_count ), 
                        isLoading: false,
                        articles,
                        topic: slug,                            
                        articlesFound: true,    
                        pageClicked: false,
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: true
                    } );
                }                                    
            } )
            .catch( ( err ) => {                
                this.setState( {
                    isLoading: false,
                    hasMore: false,
                    topic: slug,
                    pageClicked: false,
                    prevClicked: true,
                    articlesFound: false } );
            } ); 
    }

    handlePageClick = ( pageOffset ) => {        
        this.setState( ( { pageNum, accumCount, pageClicked, articles } ) => ( {
            pageNum: pageNum + pageOffset,
            pageClicked: true,
            prevClicked: pageOffset === -1,
            accumCount: pageOffset === -1 ? accumCount - articles.length : accumCount
        } ) );
    }

    render () {
        const slug = this.props.slug;
        const articleArr = this.state.articles;
        const { screenSize, articlesFound, isLoading , accumCount, pageNum, totalCount } = this.state;             
        return (
            <div className="articlesByTopic">
                <BreadCrumb currentPage={`Articles on: ${ slug }`}/>
                
                {
                    isLoading
                        ? <h3>Loading...</h3>

                        : articlesFound && articleArr
                            ? <div>                            
                                <Row className="browseFuncsRow">     
                                    <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => this.handlePageClick( -1 )} variant="outline-primary" disabled={pageNum === 1 || articleArr.length === 0}>Previous</Button>                               <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => this.handlePageClick( 1 )} variant="outline-primary" disabled={accumCount === totalCount}>Next</Button>                       
                                </Row>

                                <Row className="articleListRow">
                                    <Col xs={9}>
                                        {
                                            articleArr.map( ( article, idx ) => {  
                                                return <ArticleListItem size={screenSize} key={idx} article={article} idx={idx}/>;
                                            } )                                                                    
                                        }                             
                                    </Col>
                                </Row>
                            </div>
                            : <h3 className="noResults">No articles found for topic: {slug}</h3>                                      
                }                
            </div>
        );
    }
}

export default SingleTopic;