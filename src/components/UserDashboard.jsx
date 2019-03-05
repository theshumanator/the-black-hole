import React, { Component } from 'react';
import {getAllArticles} from '../utils/APICalls';
import {Link} from '@reach/router';

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
        .then((articles) => {
            if (Array.isArray(articles)) {
                this.setState({articles: articles, requestedUser: this.props.username, articlesFound: true});
            } else {
                this.setState({articles: [], requestedUser: this.props.username, articlesFound: false});
            } 
        })
        .catch(error => console.log('got : ' + error))
    }

    render() {
        const username = this.props.username;
        const articleArr = this.state.articles;
        return (
            <div>
                <h3>Articles by {username}</h3>
                {
                    this.state.articlesFound
                        ? articleArr &&
                                articleArr.map(article => {                        
                                    return (
                                        <p key={article.article_id}>{article.topic}: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> {article.created_at}</p>
                                    )
                                })                            
                        :   <p>No articles found for {username}</p>
                }
                
            </div>
        )
    }
}
export default UserDashboard;