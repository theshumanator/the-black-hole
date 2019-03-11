import React, { Component } from 'react';
import { Row, Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import { throttle } from 'lodash';
import SingleComment from './SingleComment';
import { commentsSortDropdowns } from '../utils/dropdowns';
import SortDropdown from './SortDropdown';
import AddNewCommentForm from './AddNewCommentForm';
import { shouldScroll, hasSpaceForMore } from '../utils/infiniteScroll';
import axios from 'axios';

class ArticleComments extends Component {

    //avoid memory leak cancel all axios requests, etc
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    _isMounted = false;

    state = {
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        comments: [],
        reQuery: true,
        showNewCommentModal: false,        
        hasMore: true,
        isLoading: true,    
        pageNum: 1, //default
    }

    handleNewCommentClose = () => {
        this.setState( { showNewCommentModal: false, reQuery: true, isLoading: false } );
    } 

    handleAddNewComment = () => {
        this.setState( { showNewCommentModal: true, reQuery: false, isLoading: false } );
    }

    handleDeleteDone = () => {
        this.setState( { reQuery: true, isLoading: false } );
    }

    handleSortSelect = ( eventKey ) => {
        const sortArr = eventKey.split( ' ' );
        this.setState( { sortByKey: sortArr[ 0 ], sortOrder: sortArr[ 1 ], reQuery: true } );
    }

    handleScroll = throttle( ( ) => {           
        const { hasMore, isLoading } = this.state;
        if ( hasMore && !isLoading && shouldScroll( '.commentListDiv' ) ) {
            this.fetchComments();
        }        
    }, 500 );

    componentDidMount () {                 
        this._isMounted = true;     
        //window.addEventListener( 'resize', this.handleScreenResize, false ); 
        window.addEventListener( 'scroll', this.handleScroll );        
        this.fetchComments(); 
    }

    componentWillUnmount () {                
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        window.removeEventListener( 'resize', this.handleScreenResize, false ); 
        //window.removeEventListener( 'scroll', this.handleScroll );        
        this._isMounted = false;
    }

    componentDidUpdate ( ) {
        const { reQuery, hasMore, isLoading } = this.state;                
        if ( reQuery ) {
            this.setState( { pageNum: 1, reQuery: false }, () => this.fetchComments() );
        } else if ( !isLoading && hasMore && document.querySelector( '.commentListDiv' ) !== null ) {
            //scenario where we load the first batch but there is more space in the window so need to load more
            if ( hasSpaceForMore( '.commentListDiv' ) ) {
                this.fetchComments();
            }
        }

    }
    
    fetchComments () {
        let { pageNum } = this.state;
        const { sortByKey, sortOrder } = this.state;
        const { article_id } = this.props.article;
        const params = { sort_by: sortByKey, order: sortOrder, p: pageNum };
        const apiObj = {
            url: `/articles/${ article_id }/comments`,
            reqObjectKey: 'data',
            method: 'get',
            params,
            cancelToken: this.source.token,
            multiRes: true
        };

        this._isMounted && makeAPICalls( apiObj )
            .then( ( { comments, total_count } ) => {
                const morePendingRecords = ( comments.length + this.state.comments.length ) < total_count;                                           
                this.setState( {
                    hasMore: morePendingRecords,
                    isLoading: false,
                    comments: pageNum === 1 ? comments : [ ...this.state.comments, ...comments ],
                    pageNum: morePendingRecords ? ++pageNum : pageNum,
                    reQuery: false                                           
                } );
                           
            } )
            .catch( ( err ) => {
                if ( !axios.isCancel( err ) ) {
                    this.setState( {
                        isLoading: false,
                        hasMore: false,
                        comments: pageNum === 1 ? [] : this.state.comments, 
                        reQuery: false,
                        pageNum: pageNum > 1 ? --pageNum : pageNum } );
                }                
            } );                  
    }

    render () {
        const { article, loggedUser, size } = this.props;
        const { comments, showNewCommentModal, isLoading, hasMore } = this.state;
        
        return (
            <div className="commentList">
                {
                    isLoading && !hasMore
                        ? <h3>Loading...</h3>
                        : <div>              
                            <h3 className="articleCommentHeader">Article Comments</h3>
                            <Row className="addSortComment">
                                {
                                    loggedUser && <Button className="addButton" size={size} variant="primary" onClick={this.handleAddNewComment}>Add a Comment</Button>
                                }    
                                <SortDropdown className="commentSort" sortDropdowns={commentsSortDropdowns} handleSortSelect={this.handleSortSelect} size={size}/>
                            </Row>
                            <AddNewCommentForm showNewCommentModal={showNewCommentModal} loggedUser={loggedUser} articleId={article.article_id} 
                                handleNewCommentClose={this.handleNewCommentClose}/>                           
                            <div className="commentListDiv">
                                {
                                    comments && comments.map( ( comment, idx ) => {                                
                                        return <SingleComment size={size} key={idx} articleId={article.article_id} comment={comment} loggedUser={loggedUser} 
                                            handleDeleteDone={this.handleDeleteDone}/>;
                                    } )
                                }
                            </div>
                        </div>
                }
            </div>
            
        );
    }
}
export default ArticleComments;