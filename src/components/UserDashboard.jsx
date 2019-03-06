import React, { Component } from 'react';
import {getAllArticles, deleteArticle} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Row, Col, Button} from 'react-bootstrap';

class UserDashboard extends Component {

    state = {
        requestedUser: null,
        articles: [],
        articlesFound: true
    }
    componentDidMount () {
        this.fetchArticles();
    }

    componentDidUpdate() {
        if (this.state.requestedUser!==this.props.username) {
            this.fetchArticles();
        }
    }

    fetchArticles () {
        getAllArticles({author: this.props.username})
        .then(({articles}) => {
            if (Array.isArray(articles)) {
                this.setState({articles: articles, requestedUser: this.props.username, articlesFound: true});
            } else {
                this.setState({articles: [], requestedUser: this.props.username, articlesFound: false});
            } 
        })
        .catch(error => console.log('got : ' + error))
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
        const {username, loggedUser} = this.props.username;
        const articleArr = this.state.articles;
        return (
            <div>
                <h3>Articles by {username}</h3>
                {
                    this.state.articlesFound
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
                
            </div>
        )
    }
}
export default UserDashboard;