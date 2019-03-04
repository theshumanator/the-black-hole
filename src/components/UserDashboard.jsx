import React, { Component } from 'react';
import {getArticlesByUser} from '../utils/APICalls';
import {Link} from '@reach/router';

class UserDashboard extends Component {

    state = {
        requestedUser: null,
        articles: null
    }
    componentDidMount () {
        getArticlesByUser(this.props.username)
            .then((articles) => {
                this.setState({articles: articles, requestedUser: this.props.username});
            })
            .catch(error => console.log('got : ' + error))
    }

    componentDidUpdate() {
        if (this.state.requestedUser!==this.props.username) {
            getArticlesByUser(this.props.username)
            .then((articles) => {
                this.setState({articles: articles, requestedUser: this.props.username});
            })
            .catch(error => console.log('got : ' + error))
        }
    }
    render() {
        const username = this.props.username;
        const articleArr = this.state.articles;
        return (
            <div>
                <h3>Articles by {username}</h3>
                {articleArr &&
                    articleArr.map(article => {                        
                        return (
                            <p key={article.article_id}>{article.topic}: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> {article.created_at}</p>
                        )
                    })
                }
            </div>
        )
    }
}
export default UserDashboard;