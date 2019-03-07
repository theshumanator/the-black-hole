import React, { Component } from 'react';
import {Row, Col, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import {getArticleComments} from '../utils/APICalls'
import SingleComment from './SingleComment';
import AddNewComment from './AddNewComment';
import { throttle } from "lodash";

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

    handleScroll = throttle((event) => {     
        let {pageNum} = this.state;   
        const { clientHeight, scrollTop, scrollHeight } = event.target.documentElement;        
        const distanceFromBottom = scrollHeight - (clientHeight + scrollTop);        
        if (distanceFromBottom < 200) {
          this.setState({ pageNum: ++pageNum});
        }
      }, 500);


    addScrollEventListener = () => {
        document.querySelector('.commentList').addEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
    }
    componentDidMount () {         
       this.fetchComments();
       this.addScrollEventListener();
    }

    componentDidUpdate (prevProps, prevState) {
        const { pageNum, hasMore, reQuery } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        if (hasPageChanged && hasMore) {
            this.fetchComments(pageNum);
        } else if (reQuery) {
            this.fetchComments();
        }
    }

    
    fetchComments (pageNum=1) {
        getArticleComments(this.props.article.article_id, {sort_by: this.state.sortByKey, order: this.state.sortOrder, p:pageNum})
            .then(({comments, total_count}) => {                    
                if (!Array.isArray(comments)) {
                    this.setState({
                        isLoading: false,
                        hasMore: false,
                        comments: [], 
                        reQuery: false})
                } else {                 
                    this.setState({
                        hasMore: ((this.state.comments.length + comments.length)<total_count),                        
                        isLoading: false,
                        comments: pageNum!==1?[...this.state.comments, ...comments]:comments,
                        reQuery: false,
                        pageNum: pageNum
                    })

                }            
            })
            .catch(error => console.log('got : ' + error))                  
    }

    render () {
        const {article, loggedUser} = this.props;
        const {comments, showNewCommentModal, hasMore, isLoading} = this.state;                
        
        return (
            <div className="commentList">
                {
                    isLoading
                    ?   <h3>Loading...</h3>
                    :   <div>
                            <h4>Comments</h4>
                            <Row>
                                <Col xs={3}>
                                    {
                                        <DropdownButton id="dropdown-basic-button" title="Sort By" variant='secondary'>
                                            <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                                            <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                                            <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                                            <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                                            <Dropdown.Item eventKey="author asc" onSelect={this.handleSortSelect}>Author (A-Z)</Dropdown.Item>
                                            <Dropdown.Item eventKey="author desc" onSelect={this.handleSortSelect}>Author (Z-A)</Dropdown.Item>                        
                                        </DropdownButton>
                                    }
                                </Col>
                                <Col>
                                    {
                                        loggedUser && <Button variant="primary" onClick={this.handleAddNewComment}>Add a Comment</Button>
                                    }
                                </Col>                    
                            </Row>            
                            {
                                showNewCommentModal && loggedUser && <AddNewComment articleId={article.article_id} loggedUser={this.props.loggedUser} showNewCommentModal={showNewCommentModal} handleNewCommentClose={this.handleNewCommentClose}/>
                            }
                            <div>                            
                            {
                                comments && comments.map((comment, idx) => {                                
                                return <SingleComment key={idx} articleId={article.article_id} comment={comment} loggedUser={this.props.loggedUser} handleDeleteDone={this.handleDeleteDone}/>
                                })
                            }
                            </div>
                            {!hasMore && comments.length>0 &&
                                <h3>You did it! You reached the end!</h3>
                            }
                        </div>
                }

                
            </div>
            
        )
    }
}
export default ArticleComments;