import React, { Component } from 'react';
import {getAllArticles, deleteArticle} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Row, Col, Button, Breadcrumb} from 'react-bootstrap';
import { throttle } from "lodash";
import PrettyDate from './PrettyDate';

class UserDashboard extends Component {

    state = {
        requestedUser: null,
        articles: [],
        articlesFound: true,
        error: false,
        hasMore: true,
        isLoading: true,
        pageNum: 1, //default
    }
    componentDidMount () {
        this.fetchArticles();
        this.addScrollEventListener();
    }

    componentDidUpdate (prevProps, prevState) {
        let {pageNum} = this.state;   
        const { hasMore, requestedUser, isLoading } = this.state;       
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasUserChanged = requestedUser!==this.props.username;


        if (hasPageChanged && hasMore) {
            this.fetchArticles(pageNum);
        } else if (hasUserChanged) {
            this.fetchArticles();
        } else if (hasMore && pageNum===1 && !isLoading) {
            //load more to fill screen
            this.setState({ pageNum: ++pageNum});
        }
    }

    addScrollEventListener = () => {
        document.querySelector('.articlesList').addEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = throttle((event) => {     
        let {pageNum} = this.state;   
        const { clientHeight, scrollTop, scrollHeight } = event.target.documentElement;        
        const distanceFromBottom = scrollHeight - (clientHeight + scrollTop);             
        if (distanceFromBottom < 200) {
          this.setState({ pageNum: ++pageNum});
        }
    }, 500);

    fetchArticles (pageNum=1) {
        getAllArticles({author: this.props.username, p: pageNum})
            .then(({articles, total_count}) => { 
                if (!Array.isArray(articles)) {
                    this.setState({
                        hasMore: false,                        
                        isLoading: false,
                        pageNum,
                        articles: [], 
                        requestedUser: this.props.username, 
                        articlesFound: false});
                } else {
                    this.setState({                        
                        hasMore: ((this.state.articles.length + articles.length)<total_count),
                        isLoading: false,
                        //if it's the not the first page then just concat the 2 arrays
                        articles: pageNum!==1?[...this.state.articles, ...articles]:articles, 
                        requestedUser: this.props.username,
                        articlesFound: true,
                        //pageNum: pageNum===1?pageNum
                    })
                } 
            })
            .catch(error => console.log('got : ' + error)) 
    }

    handleDelete = (articleId) => {        
        deleteArticle(articleId)
            .then((status) => {
                if(status===204) {
                    this.setState({ pageNum: 1, articles: [], hasMore: true, isLoading: true});                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    render() {        
        const {username, loggedUser} = this.props;
        const articleArr = this.state.articles;
        const {articlesFound, hasMore, isLoading} = this.state;     
        return (
            <div className="articlesList">
                {/* <h3>Articles by {username}</h3> */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                    
                    <Breadcrumb.Item active>Articles by {username}</Breadcrumb.Item>
                </Breadcrumb>
                {                    
                    isLoading
                    ?   <h3>Loading...</h3>
                    :   <div>
                        {
                            articlesFound
                                ? articleArr &&
                                        articleArr.map(article => {                        
                                            return (
                                                <Row key={article.article_id}>
                                                    <Col>
                                                        <p key={article.article_id}>{article.topic}: 
                                                            <Link to={`/articles/${article.article_id}`}>{article.title}</Link> 
                                                            
                                                            <PrettyDate dateType="longDate" created_at={article.created_at}/>
                                                        </p>
                                                    </Col>
                                                    {   loggedUser === username &&
                                                        <Col>
                                                            <Button variant="danger" size="sm" onClick={()=>this.handleDelete(article.article_id)}>Delete article</Button>
                                                        </Col>
                                                    }
                                                    
                                                </Row>                                                
                                            )
                                        })                            
                                :   <p>No articles found for {username}</p>                                
                            }
                            {!hasMore && articlesFound &&
                                <h3>You did it! You reached the end!</h3>
                            }
                        </div>
                    
                }                
            </div>
        )
    }
}
export default UserDashboard;