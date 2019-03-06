import React, { Component, Fragment} from 'react';
import {Link} from '@reach/router';
import {getAllArticles} from '../utils/APICalls';
import {Dropdown, DropdownButton, Row, Col, Button} from 'react-bootstrap'
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';

class HomeBody extends Component {
      
    state = {
        error: false,
        hasMore: true,
        loadMore: false,
        isLoading: false,
        articles: [],
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        pageNum: 1, //default
        reQuery: true,
        showNewTopicModal: false,
        showNewArticleModal: false
    };
      

    handleScroll = (event) => {        
        console.log('handleScroll')        

        const {error,isLoading,hasMore,pageNum, loadMore} = this.state;
    
        //console.log(hasMore,loadMore,pageNum)
        if (error || isLoading || (!hasMore && !loadMore)) return;

        /* if (localStorage.getItem('currScrollHeight')) {
            document.documentElement.scrollTop = localStorage.getItem('currScrollHeight');
            localStorage.removeItem('currScrollHeight')
        } */
        /* const node = document.documentElement;
        console.log(`window.innerHeight is ${window.innerHeight} scrolltop is: ${node.scrollTop} offsetheight is ${node.offsetHeight} and scrollheigh is ${node.scrollHeight}`)        
        if (hasMore) {            
            //document.documentElement.scrollTop = window.innerHeight;
        } */

        //console.log('the scroll things', event)
        console.log(window.innerHeight, document.documentElement.scrollTop, 
            document.documentElement.scrollHeight , document.documentElement.offsetHeight) 
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
            console.log(`Load more? ${loadMore} & has more? ${hasMore}`)
            if (hasMore) {
                console.log('Reached end of page so fetching more')  
                localStorage.setItem('currScrollHeight', document.documentElement.scrollTop);              
                this.fetchArticles(pageNum+1);
            } else {
                console.log('Reached end and no more available')
                //localStorage.removeItem('currScrollHeight')
            }            
        } /* else {
            localStorage.removeItem('currScrollHeight')
        } */
    }


    handleSortSelect = (eventKey) => {
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true, articles:[], pageNum: 1});
    }

    handleShowNewTopic = () => {
        console.log('bringing up new modal')
        this.setState({ showNewTopicModal: true, reQuery: false });
    }

    handleNewTopicClose = () => {
        console.log('Closing new topic modal')
        this.setState({ showNewTopicModal: false, reQuery: false });
    } 

    handleShowNewArticle = () => {
        console.log('bringing up new modal')
        this.setState({ showNewArticleModal: true, reQuery: false });
    }

    handleNewArticleClose = () => {
        console.log('Closing new articl modal')
        this.setState({ showNewArticleModal: false, reQuery: true, articles:[], pageNum: 1 });
    } 
          
    componentDidMount () {   
        console.log('Mounted so fetching')     
        this.fetchArticles();
    }

    
    componentDidUpdate () {   

        //console.log(this.state.reQuery, this.state.loadMore ,this.state.isLoading)
        if(this.state.reQuery && !this.state.isLoading ) {    
            //console.log('in requery part')        
            this.fetchArticles();
        } else if (this.state.loadMore && !this.state.isLoading) {
            //console.log('Should i fetch?')
            //console.log(window.innerHeight, document.documentElement.scrollTop , document.documentElement.offsetHeight) 
            if (window.innerHeight+document.documentElement.scrollTop>=document.documentElement.offsetHeight) {
                //console.log('Going to call handleScroll')
                this.handleScroll()
            }
        }       
    }

    componentWillMount () {              
        //console.log('adding scroll to event listener')
        window.addEventListener('scroll', this.handleScroll);        
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    fetchArticles (pageNum=1) {
        this.setState({isLoading: true},
            ()=>getAllArticles({sort_by: this.state.sortByKey, order: this.state.sortOrder, p: pageNum})
                .then(({articles, total_count}) => {                    
                    //console.log(this.state.articles.length, articles.length, total_count)
                    //this.setState({articles: articles, reQuery: false});
                    this.setState({
                        //hasMore: (this.state.articles.length<total_count),
                        hasMore: ((this.state.articles.length + articles.length)<total_count),
                        loadMore: (this.state.articles.length!==total_count),
                        isLoading: false,
                        articles: [...this.state.articles, ...articles],
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
        const {error, hasMore, isLoading} = this.state;     
        const loggedUser = this.props.loggedUser;
        console.log('articleArr in render: ' + articleArr.length);
        //console.log(isLoading, hasMore);
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
                            </DropdownButton>
                        </Col>{/* 
                        <Col>
                            <DropdownButton id="dropdown-filter-button" title="Filter articles by topic" variant='primary'>
                                <Dropdown.Item eventKey="created_at desc" onSelect={this.handleFilterSelect}>Football</Dropdown.Item>
                                <Dropdown.Item eventKey="created_at asc" onSelect={this.handleFilterSelect}>Coding</Dropdown.Item>
                            </DropdownButton>
                        </Col> */}

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
                    
                    {
                        articleArr && <div className="articlesList">
                        {articleArr.map((article, idx) => {                       
                            return (
                                <p key={idx}><Link to={`/topics/${article.topic}`}>{article.topic}</Link>: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> 
                                <span> BY: <Link to={`/users/${article.author}`}>{article.author}</Link></span> 
                                {article.created_at}
                                </p>
                            )
                        })}</div>
                        
                    }                
                    {!hasMore &&
                        <h3>You did it! You reached the end!</h3>
                    }
                </div>
            
            }
            </div>
        )
    }
}

export default HomeBody;

