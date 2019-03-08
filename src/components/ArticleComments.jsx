import React, { Component } from 'react';
import {Row, Button} from 'react-bootstrap';
import {getArticleComments} from '../utils/APICalls'
import SingleComment from './SingleComment';
import AddNewComment from './AddNewComment';
import {commentsSortDropdowns} from '../utils/dropdowns';
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
        console.log('Closing new comment modal')
        this.setState({showNewCommentModal: false, reQuery: true, isLoading: false});
    } 


    handleAddNewComment = () => {
        this.setState({showNewCommentModal: true, reQuery: false, isLoading: false});
    }

    handleDeleteDone = () => {
        //console.log('inHandleDelete')
        this.setState({reQuery: true, isLoading: false});
    }

    handleSortSelect = (eventKey) => {
        console.log(eventKey);
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true});
    }

    componentDidMount () {         
       this.fetchComments();
    }

    componentDidUpdate (prevProps, prevState) {
        const {reQuery, pageNum, pageClicked} = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        if (reQuery) {
            this.setState({pageNum:1, reQuery: false}, () => this.fetchComments());
        } 
        if (hasPageChanged && pageClicked) {
            this.fetchComments();
        }

    }

    
    fetchComments () {
        let {pageNum, accumCount, prevClicked} = this.state;
        getArticleComments(this.props.article.article_id, {sort_by: this.state.sortByKey, order: this.state.sortOrder, p:pageNum})
            .then(({comments, total_count}) => {                    
                if (!Array.isArray(comments)) {
                    this.setState({
                        isLoading: false,
                        hasMore: false,
                        comments: [], 
                        reQuery: false,
                        pageNum: --pageNum,
                        pageClicked: false,
                        prevClicked: true})
                } else {      
                    if (pageNum===1) {
                        accumCount=comments.length;
                    } else if (!prevClicked) {
                        accumCount+=comments.length
                    }  
                    /* if (!prevClicked) {
                        accumCount+=comments.length
                    }   */
                           
                    this.setState({
                        hasMore: ((accumCount + comments.length)<total_count),         
                        isLoading: false,
                        comments,
                        reQuery: false,                        
                        pageClicked: false,
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: false
                    })

                }            
            })
            .catch(error => console.log('got : ' + error))                  
    }

    handlePageClick = (pageOffset) => {        
        this.setState(({pageNum, accumCount, pageClicked, comments}) => ({
            pageNum: pageNum + pageOffset,
            pageClicked: true,
            prevClicked: pageOffset===-1,
            accumCount: pageOffset===-1?accumCount-comments.length:accumCount
          }));
    }

    render () {
        const {article, loggedUser, size} = this.props;
        const {comments, showNewCommentModal, isLoading, accumCount, pageNum, totalCount} = this.state;                
        
        return (
            <div className="commentList">
                {
                    isLoading
                    ?   <h3>Loading...</h3>
                    :   <div>              
                            <h3 className="articleCommentHeader">Article Comments</h3>      
                            <Row className="addSortComment">    
                                                                
                                {
                                    loggedUser && <Button className="addButton" size={size} variant="primary" onClick={this.handleAddNewComment}>Add a Comment</Button>
                                }
                                {
                                        /* <DropdownButton  size={size} id="dropdown-basic-button" title="Sort By" variant='secondary'>
                                            <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                                            <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                                            <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                                            <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                                            <Dropdown.Item eventKey="author asc" onSelect={this.handleSortSelect}>Author (A-Z)</Dropdown.Item>
                                            <Dropdown.Item eventKey="author desc" onSelect={this.handleSortSelect}>Author (Z-A)</Dropdown.Item>                        
                                        </DropdownButton> */
                                }      
                                <SortDropdown sortDropdowns={commentsSortDropdowns} handleSortSelect={this.handleSortSelect} size={size}/>                                                                 
                             

                                <div className="commentPrevNext">                                
                                    <Button size={size} className = "prevNextButton" onClick={()=>this.handlePageClick(-1)} variant="outline-primary" disabled={pageNum===1 || comments.length===0}>Previous</Button>
                                    <Button size={size} className = "prevNextButton prevNextGap" onClick={()=>this.handlePageClick(1)} variant="outline-primary" disabled={accumCount===totalCount}>Next</Button>                                 
                                </div>                                                
                            </Row>         
                            {
                                showNewCommentModal && loggedUser && <AddNewComment articleId={article.article_id} loggedUser={this.props.loggedUser} showNewCommentModal={showNewCommentModal} handleNewCommentClose={this.handleNewCommentClose}/>
                            }
                            <div>                            
                            {
                                comments && comments.map((comment, idx) => {                                
                                return <SingleComment size={size} key={idx} articleId={article.article_id} comment={comment} loggedUser={this.props.loggedUser} handleDeleteDone={this.handleDeleteDone}/>
                                })
                            }
                            </div>
                        </div>
                }

                
            </div>
            
        )
    }
}
export default ArticleComments;