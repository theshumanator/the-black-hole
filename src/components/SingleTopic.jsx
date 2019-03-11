import React, { Component } from 'react';
import { makeAPICalls } from '../utils/APICalls';
import { Col, Row } from 'react-bootstrap';
import { throttle } from 'lodash';
import ArticleListItem from './ArticleListItem';
import BreadCrumb from './BreadCrumb';
import { shouldScroll, hasSpaceForMore } from '../utils/infiniteScroll';
import axios from 'axios';

class SingleTopic extends Component {

    //avoid memory leak cancel all axios requests, etc
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    _isMounted = false;

    state = {
        topic: null,
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
        this.fetchArticles();
    }

    componentWillUnmount () {                
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        window.removeEventListener( 'resize', this.handleScreenResize, false ); 
        window.removeEventListener( 'scroll', this.handleScroll );        
        this._isMounted = false;
    }

    componentDidUpdate( ) {        
        const { isLoading, hasMore } = this.state;
        if ( !isLoading && hasMore && document.querySelector( '.articleListRow' ) !== null ) {
            //scenario where we load the first batch but there is more space in the window so need to load more
            if ( hasSpaceForMore( '.articleListRow' ) ) {
                this.fetchArticles();
            }
        }
    }

    handleScroll = throttle( ( ) => {           
        const { hasMore, isLoading } = this.state;
        if ( hasMore && !isLoading && shouldScroll( '.articleListRow' ) ) {
            this.fetchArticles();
        }        
    }, 500 );

    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
        } );
    }

    fetchArticles = () => {
        let { pageNum } = this.state;
        const { slug } = this.props;
        const params = { topic: slug, p: pageNum };
        const apiObj = {
            url: '/articles',
            reqObjectKey: 'data',
            method: 'get',
            params,
            cancelToken: this.source.token,
            multiRes: true
        };
        
        this._isMounted && makeAPICalls( apiObj )
            .then( ( { articles, total_count } ) => {     
                const morePendingRecords = ( articles.length + this.state.articles.length ) < total_count;
                this.setState( {
                    hasMore: morePendingRecords,
                    isLoading: false,
                    articles: pageNum === 1 ? articles : [ ...this.state.articles, ...articles ],
                    topic: slug,                            
                    articlesFound: true,
                    pageNum: morePendingRecords ? ++pageNum : pageNum,
                } );                                                    
            } )
            .catch( ( err ) => {     
                if ( !axios.isCancel( err ) ) {
                    this.setState( {
                        isLoading: false,
                        hasMore: false,
                        topic: slug,
                        pageNum: pageNum > 1 ? --pageNum : pageNum, 
                        articlesFound: false } );
                }                           
            } ); 
    }

    render () {
        const slug = this.props.slug;
        const articleArr = this.state.articles;
        const { screenSize, articlesFound, hasMore, isLoading } = this.state;             
        return (
            <div className="articlesByTopic">
                <BreadCrumb currentPage={`Articles on: ${ slug }`}/>                
                {
                    isLoading && !hasMore
                        ? <h3>Loading...</h3>
                        : articlesFound && articleArr
                            ? <div>                
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