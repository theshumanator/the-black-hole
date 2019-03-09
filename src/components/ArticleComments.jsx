import React, { Component } from 'react';
import { Row, Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import SingleComment from './SingleComment';
import AddNewComment from './AddNewComment';
import { commentsSortDropdowns } from '../utils/dropdowns';
import SortDropdown from './SortDropdown';

class ArticleComments extends Component {

    state = {
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        comments: [],
        reQuery: true,
        showNewCommentModal: false,
        error: false,
        hasMore: true,
        isLoading: true,    
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false,
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

    componentDidMount () {         
        this.fetchComments();
    }

    componentDidUpdate ( prevProps, prevState ) {
        const { reQuery, pageNum, pageClicked } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        if ( reQuery ) {
            this.setState( { pageNum: 1, reQuery: false }, () => this.fetchComments() );
        } 
        if ( hasPageChanged && pageClicked ) {
            this.fetchComments();
        }

    }
    
    fetchComments () {
        let { pageNum, accumCount, prevClicked } = this.state;
        const { sortByKey, sortOrder } = this.state;
        const { article_id } = this.props.article;
        const params = { sort_by: sortByKey, order: sortOrder, p: pageNum };
        const apiObj = {
            url: `/articles/${ article_id }/comments`,
            reqObjectKey: 'data',
            method: 'get',
            params,
            multiRes: true
        };

        makeAPICalls( apiObj )
            .then( ( { comments, total_count } ) => {                    
                if ( !Array.isArray( comments ) ) {
                    this.setState( {
                        isLoading: false,
                        hasMore: false,
                        comments: [], 
                        reQuery: false,
                        pageNum: --pageNum,
                        pageClicked: false,
                        prevClicked: true } );
                } else {      
                    if ( pageNum === 1 ) {
                        accumCount = comments.length;
                    } else if ( !prevClicked ) {
                        accumCount += comments.length;
                    }                             
                    this.setState( {
                        hasMore: ( ( accumCount + comments.length ) < total_count ),         
                        isLoading: false,
                        comments,
                        reQuery: false,                        
                        pageClicked: false,
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: false
                    } );

                }            
            } )
            .catch( ( error ) => {
                this.setState( {
                    isLoading: false,
                    hasMore: false,
                    comments: [], 
                    reQuery: false,
                    pageNum: --pageNum,
                    pageClicked: false,
                    prevClicked: true } );
            } );                  
    }

    handlePageClick = ( pageOffset ) => {        
        this.setState( ( { pageNum, accumCount, pageClicked, comments } ) => ( {
            pageNum: pageNum + pageOffset,
            pageClicked: true,
            prevClicked: pageOffset === -1,
            accumCount: pageOffset === -1 ? accumCount - comments.length : accumCount
        } ) );
    }

    render () {
        const { article, loggedUser, size } = this.props;
        const { comments, showNewCommentModal, isLoading, accumCount, pageNum, totalCount } = this.state;                
        
        return (
            <div className="commentList">
                {
                    isLoading
                        ? <h3>Loading...</h3>
                        : <div>              
                            <h3 className="articleCommentHeader">Article Comments</h3>      
                            <Row className="addSortComment">    
                                                                
                                {
                                    loggedUser && <Button className="addButton" size={size} variant="primary" onClick={this.handleAddNewComment}>Add a Comment</Button>
                                }    
                                <SortDropdown sortDropdowns={commentsSortDropdowns} handleSortSelect={this.handleSortSelect} size={size}/>                                                                 

                                <div className="commentPrevNext">                                
                                    <Button size={size} className = "prevNextButton" onClick={() => this.handlePageClick( -1 )} variant="outline-primary" disabled={pageNum === 1 || comments.length === 0}>Previous</Button>
                                    <Button size={size} className = "prevNextButton prevNextGap" onClick={() => this.handlePageClick( 1 )} variant="outline-primary" disabled={accumCount === totalCount}>Next</Button>                                 
                                </div>                                                
                            </Row>         
                            {
                                showNewCommentModal && loggedUser && <AddNewComment articleId={article.article_id} loggedUser={this.props.loggedUser} showNewCommentModal={showNewCommentModal} handleNewCommentClose={this.handleNewCommentClose}/>
                            }
                            <div>                            
                                {
                                    comments && comments.map( ( comment, idx ) => {                                
                                        return <SingleComment size={size} key={idx} articleId={article.article_id} comment={comment} loggedUser={this.props.loggedUser} handleDeleteDone={this.handleDeleteDone}/>;
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