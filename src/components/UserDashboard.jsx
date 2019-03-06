import React, { Component } from 'react';
import {getAllArticles, deleteArticle} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Row, Col, Button} from 'react-bootstrap';

class UserDashboard extends Component {

    state = {
        requestedUser: null,
        articles: [],
        articlesFound: true,
        error: false,
        hasMore: true,
        loadMore: false,
        isLoading: false,
        pageNum: 1, //default
    }
    componentDidMount () {
        this.fetchArticles();
    }

    componentDidUpdate() {
        if (this.state.requestedUser!==this.props.username && !this.state.isLoading) {
            this.fetchArticles();
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

    handleScroll = (event) => {        
        const {error,isLoading,hasMore,pageNum, loadMore} = this.state;
        if (error || isLoading || (!hasMore && !loadMore)) return;
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
            console.log(`Load more? ${loadMore} & has more? ${hasMore}`)
            if (hasMore) {
                console.log('Reached end of page so fetching more')  
                localStorage.setItem('currScrollHeight', document.documentElement.scrollTop);              
                this.fetchArticles(pageNum+1);
            } else {
                console.log('Reached end and no more available')
            }            
        }
    }

    fetchArticles (pageNum=1) {
        this.setState({isLoading: true},
            ()=>getAllArticles({author: this.props.username, p: pageNum})
                .then(({articles, total_count}) => { 
                    if (!Array.isArray(articles)) {
                        this.setState({
                            hasMore: false,
                            loadMore: false,
                            isLoading: false,
                            pageNum,
                            articles: [], 
                            requestedUser: this.props.username, 
                            articlesFound: false});
                    } else {
                        this.setState({                        
                            hasMore: ((this.state.articles.length + articles.length)<total_count),
                            loadMore: (this.state.articles.length!==total_count),
                            isLoading: false,
                            articles: [...this.state.articles, ...articles],
                            requestedUser: this.props.username,
                            articlesFound: true,
                            pageNum: pageNum
                        }, () => {
                            if (localStorage.getItem('currScrollHeight')) {
                                document.documentElement.scrollTop = localStorage.getItem('currScrollHeight');
                                localStorage.removeItem('currScrollHeight');
                            }
                        })
                    } 
                })
                .catch(error => console.log('got : ' + error)) )
    }

    handleDelete = (articleId) => {        
        deleteArticle(articleId)
            .then((status) => {
                if(status===204) {
                    this.fetchArticles();
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    render() {
        const {username, loggedUser} = this.props;
        const articleArr = this.state.articles;
        const {articlesFound, hasMore, isLoading} = this.state;     
        return (
            <div>
                <h3>Articles by {username}</h3>
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
                                                        <p key={article.article_id}>{article.topic}: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> {article.created_at}</p>
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