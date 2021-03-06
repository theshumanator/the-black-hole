import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import { throttle } from 'lodash';
import SingleComment from './SingleComment';
import { commentsSortDropdowns } from '../utils/dropdowns';
import SortDropdown from './SortDropdown';
import NewCommentForm from './NewCommentForm';
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
        dropDownTitle: 'Sort By',
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

    handleSortSelect = ( eventKey, e ) => {
        const sortArr = eventKey.split( ' ' );        
        this.setState( { sortByKey: sortArr[ 0 ], sortOrder: sortArr[ 1 ], reQuery: true, dropDownTitle: e.target.text } );
    }

    handleScroll = throttle( ( ) => {           
        const { hasMore, isLoading } = this.state;
        if ( hasMore && !isLoading && shouldScroll( '.commentListDiv' ) ) {
            this.fetchComments();
        }        
    }, 500 );

    componentDidMount () {                 
        this._isMounted = true;             
        window.addEventListener( 'scroll', this.handleScroll );        
        this.fetchComments(); 
    }

    componentWillUnmount () {                
        this.source.cancel( 'Cancel axios requests as user moved off page' );        
        window.removeEventListener( 'scroll', this.handleScroll );        
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
        const { comments, showNewCommentModal, isLoading, hasMore, dropDownTitle } = this.state;
        
        return (
            <div className="commentList">
                {
                    isLoading && !hasMore
                        ? <h3>Loading...</h3>
                        : <div>              
                            <h3 className="articleCommentHeader">Article Comments</h3>
                            <div className="addSortComment">
                                {
                                    loggedUser && <Button data-cy="addCommentButton" className="addButton" size={size} variant="primary" onClick={this.handleAddNewComment}>Add a Comment</Button>
                                }    
                            </div>
                            <SortDropdown className="commentSort" dropDownTitle={dropDownTitle} sortDropdowns={commentsSortDropdowns} handleSortSelect={this.handleSortSelect} size={size}/>
                            <NewCommentForm showNewCommentModal={showNewCommentModal} loggedUser={loggedUser} articleId={article.article_id} 
                                handleNewCommentClose={this.handleNewCommentClose}/>                           
                            <div data-cy="cyCommentList" className="commentListDiv">
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

ArticleComments.propTypes = {
    article: PropTypes.object,
    loggedUser: PropTypes.string,
    size: PropTypes.string,    
};

export default ArticleComments;