import React, { Component, Fragment} from 'react';
import {Link, navigate} from '@reach/router';
import {getAllArticles, getAllTopics} from '../utils/APICalls';
import {Dropdown, DropdownButton, Row, Col, Button} from 'react-bootstrap'
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';
import TopicsDropdown from './TopicsDropdown';
import PrettyDate from './PrettyDate';
//import MostActiveUsers from './MostActiveUsers';

class HomeBody extends Component {
      
    state = {
        error: false,
        hasMore: true,
        //loadMore: false,
        isLoading: false,
        articles: [],
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        pageNum: 1, //default
        reQuery: true,
        showNewTopicModal: false,
        showNewArticleModal: false,
        topics: []
    };
      

    handleScroll = (event) => {        
        //console.log('handleScroll')        

        //const {error,isLoading,hasMore,pageNum, loadMore} = this.state;
        const {error,isLoading,hasMore,pageNum} = this.state;
    
        
        //if (error || isLoading || (!hasMore && !loadMore)) return;
        if (error || isLoading || (!hasMore)) return;

        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {            
            if (hasMore) {
                console.log('Reached end of page so fetching more')  
                localStorage.setItem('currScrollHeight', document.documentElement.scrollTop);              
                this.fetchArticles(pageNum+1);
            } else {
                console.log('Reached end and no more available');
            }            
        }
    }


    handleFilterSelect = (eventKey) => {
        navigate(`/topics/${eventKey}`);        
    }

    handleSortSelect = (eventKey) => {
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true, articles:[], pageNum: 1});
    }

    handleShowNewTopic = () => {
        //console.log('bringing up new modal')
        this.setState({ showNewTopicModal: true, reQuery: false });
    }

    handleNewTopicClose = () => {
        //console.log('Closing new topic modal')
        this.setState({ showNewTopicModal: false, reQuery: false });
    } 

    handleShowNewArticle = () => {
        //console.log('bringing up new modal')
        this.setState({ showNewArticleModal: true, reQuery: false });
    }

    handleNewArticleClose = () => {
        //console.log('Closing new articl modal')
        this.setState({ showNewArticleModal: false, reQuery: true, articles:[], pageNum: 1 });
    } 
          
    componentDidMount () {           
        this.fetchArticles();
        this.fetchTopics()
    }

    
    componentDidUpdate () {   
        if(this.state.reQuery && !this.state.isLoading ) {                
            this.fetchArticles();
        //} else if (this.state.loadMore && !this.state.isLoading) {                    
        } else if (this.state.hasMore && !this.state.isLoading) {                    
                this.handleScroll()            
        }       
    }

    componentWillMount () {              
        //console.log('adding scroll to event listener')
        window.addEventListener('scroll', this.handleScroll);                
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    fetchTopics () {
        getAllTopics()
            .then((topics) => {
                this.setState({topics})
            })
            .catch(error => console.log('got : ' + error)) 
    }
    fetchArticles (pageNum=1) {
        this.setState({isLoading: true},
            ()=>getAllArticles({sort_by: this.state.sortByKey, order: this.state.sortOrder, p: pageNum})
                .then(({articles, total_count}) => {                    
                    this.setState({
                        hasMore: ((this.state.articles.length + articles.length)<total_count),
                        //loadMore: (this.state.articles.length!==total_count),
                        isLoading: false,
                        articles: pageNum!==1?[...this.state.articles, ...articles]:articles,
                        reQuery: false,
                        pageNum: pageNum
                    }, () => {
                        if (localStorage.getItem('currScrollHeight')) {
                            document.documentElement.scrollTop = localStorage.getItem('currScrollHeight');
                            localStorage.removeItem('currScrollHeight');
                        }
                    })
                })
                .catch(error => console.log('got : ' + error)) )
        
    }

    render() {        
        
        const articleArr = this.state.articles;   
        const { hasMore, isLoading} = this.state;     
        const loggedUser = this.props.loggedUser;        
        return (    
            <div className="articleList">
            {                 
                isLoading
                ?  <h3>Loading...</h3>
                : <div>
                    <Row>
                        <Col>
                            <DropdownButton id="dropdown-basic-button" title="Sort By" variant='primary'>
                                <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                                <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                                <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                                <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                                <Dropdown.Item eventKey="topic asc" onSelect={this.handleSortSelect}>Topic (A-Z)</Dropdown.Item>
                                <Dropdown.Item eventKey="topic desc" onSelect={this.handleSortSelect}>Topic (Z-A)</Dropdown.Item>
                                <Dropdown.Item eventKey="comment_count desc" onSelect={this.handleSortSelect}>Highest comment count</Dropdown.Item>
                                <Dropdown.Item eventKey="comment_count asc" onSelect={this.handleSortSelect}>Lowest comment count</Dropdown.Item>
                            </DropdownButton>
                        </Col>{
                        <Col>
                            <TopicsDropdown topics={this.state.topics} handleFilterSelect={this.handleFilterSelect}/>
                        </Col>}

                        {
                            loggedUser
                            ?   <Fragment>
                                    <Col>
                                        <Button variant="primary" onClick={this.handleShowNewTopic}>Create a new topic</Button>
                                        {
                                            this.state.showNewTopicModal && <NewTopicForm
                                            showNewTopicModal={this.state.showNewTopicModal}
                                            handleNewTopicClose={this.handleNewTopicClose}
                                        />
                                        }
                                    </Col>
                                    <Col>
                                        <Button variant="primary" onClick={this.handleShowNewArticle}>Create a new article</Button>
                                        {
                                            this.state.showNewArticleModal && <NewArticleForm
                                            showNewArticleModal={this.state.showNewArticleModal}
                                            handleNewArticleClose={this.handleNewArticleClose}/>
                                        }
                                    </Col>
                                </Fragment>
                            :   <Fragment/>
                        }
                    </Row>
                    <Row>
                        <Col xs={9}>
                            {articleArr && <div className="articlesList">
                            {articleArr.map((article, idx) => {                       
                                return (
                                    <p key={idx}><Link to={`/topics/${article.topic}`}>{article.topic}</Link>: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> 
                                    <span> BY: <Link to={`/users/${article.author}`}>{article.author}</Link></span> 
                                    <PrettyDate dateType="longDate" created_at={article.created_at}/>
                                    </p>
                                )
                            })}</div>
                            
                        }                
                        {!hasMore &&
                            <h3>You did it! You reached the end!</h3>
                        }
                        </Col>
                        {/* <Col>
                            <Row>
                                <h4>Most active users</h4>
                                <MostActiveUsers/>
                            </Row>
                            <p></p>
                            <Row>
                                <h4>Most popular users</h4>
                                <MostActiveUsers/>
                            </Row>
                        </Col> */}
                    </Row>                                        
                </div>
            
            }
            </div>
        )
    }
}

export default HomeBody;

