import React, { Component } from 'react';
import {getAllArticles} from '../utils/APICalls';
import {Link} from '@reach/router';

class SingleTopic extends Component {
    state = {
        topic: null,
        articles: [],
        articlesFound: true
    }

    componentDidMount () {
        this.fetchArticles();
    }

    componentDidUpdate() {
        if (this.state.topic!==this.props.slug) {
            this.fetchArticles();
        }
    }

    fetchArticles () {
        getAllArticles({topic: this.props.slug})
        .then((articles) => {
            if (Array.isArray(articles)) {
                this.setState({articles: articles, topic: this.props.slug, articlesFound: true});
            } else {
                this.setState({articles: [], topic: this.props.slug, articlesFound: false});
            } 
        })
        .catch(error => console.log('got : ' + error))
    }

    render () {
        const slug = this.props.slug;
        const articleArr = this.state.articles;
        return (
            <div>
                <h3>Articles on topic: {slug}</h3>
                {
                    this.state.articlesFound
                        ? articleArr &&
                                articleArr.map(article => {                        
                                    return (
                                        <p key={article.article_id}> <Link to={`/articles/${article.article_id}`}>{article.title}</Link> 
                                        <span> BY: <Link to={`/users/${article.author}`}>{article.author}</Link></span> 
                                        <span> ON: {article.created_at}</span></p>
                                    )
                                })                            
                        :   <p>No articles found for topic: {slug}</p>
                }
                
            </div>
        )
    }
}

export default SingleTopic;