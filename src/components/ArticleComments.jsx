import React, { Component } from 'react';
import {Row, Col, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import {getArticleComments} from '../utils/APICalls'
import SingleComment from './SingleComment';
import AddNewComment from './AddNewComment';
class ArticleComments extends Component {

    state = {
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        comments: [],
        reQuery: true,
        showNewCommentModal: false,
        error: false,
        hasMore: true,
        loadMore: false,
        isLoading: false,    
        pageNum: 1, //default
    }


    handleNewCommentClose = () => {
        console.log('Closing new comment modal')
        this.setState({showNewCommentModal: false, reQuery: true});
    } 


    handleAddNewComment = () => {
        this.setState({showNewCommentModal: true, reQuery: false});
    }

    handleDeleteDone = () => {
        this.setState({reQuery: true});
    }

    handleSortSelect = (eventKey) => {
        console.log(eventKey);
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true});
    }

    handleScroll = (event) => {        
        const {error,isLoading,hasMore,pageNum, loadMore} = this.state;
        if (error || isLoading || (!hasMore && !loadMore)) return;
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
            console.log(`Load more? ${loadMore} & has more? ${hasMore}`)
            if (hasMore) {
                console.log('Reached end of page so fetching more')  
                localStorage.setItem('currScrollHeight', document.documentElement.scrollTop);              
                this.fetchComments(pageNum+1);
            } else {
                console.log('Reached end and no more available')
            }            
        } 
    }


    componentDidMount () {        
       this.fetchComments();
    }

    componentDidUpdate () {
       if(this.state.reQuery && !this.state.isLoading ) {    
            //console.log('in requery part')        
            this.fetchComments();
        } else if (this.state.loadMore && !this.state.isLoading) {
            this.handleScroll()            
        }
    }

    componentWillMount () {              
        window.addEventListener('scroll', this.handleScroll);        
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    

    fetchComments (pageNum=1) {
        this.setState({isLoading: true},
            ()=>getArticleComments(this.props.article.article_id, {sort_by: this.state.sortByKey, order: this.state.sortOrder, p:pageNum})
                .then(({comments, total_count}) => {                    
                    if (!Array.isArray(comments)) {
                        this.setState({
                            isLoading: false,
                            hasMore: false,
                            loadMore: false,
                            comments: [], 
                            reQuery: false})
                    } else {
                        this.setState({
                            hasMore: ((this.state.comments.length + comments.length)<total_count),
                            loadMore: (this.state.comments.length!==total_count),
                            isLoading: false,
                            comments: [...this.state.comments, ...comments],
                            reQuery: false,
                            pageNum: pageNum
                        }, () => {
                            if (localStorage.getItem('currScrollHeight')) {
                                document.documentElement.scrollTop = localStorage.getItem('currScrollHeight');
                                localStorage.removeItem('currScrollHeight');
                            }
                        })

                    }            
                })
                .catch(error => console.log('got : ' + error)))            
        
    }

    render () {
        const {article, loggedUser} = this.props;
        const {comments, showNewCommentModal, hasMore, isLoading} = this.state;        
        
        return (
            <div>
                {
                    isLoading
                    ?   <h3>Loading...</h3>
                    :   <div>
                            <p>Comments: {article.comment_count}</p>
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
                            {
                                comments && comments.map((comment) => {
                                return <SingleComment key={comment.comment_id} articleId={article.article_id} comment={comment} loggedUser={this.props.loggedUser} handleDeleteDone={this.handleDeleteDone}/>
                                })
                            }
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