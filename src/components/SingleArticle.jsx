import React, { Component, Fragment } from 'react';
import {Link} from '@reach/router';
import {getArticleById} from '../utils/APICalls';

class SingleArticle extends Component {

    state = {
        article: null
    }

    componentDidMount () {
        getArticleById(this.props.articleId)
            .then((article) => { 
                this.setState({article: JSON.stringify(article)});
                
            })
            .catch(error => console.log('got : ' + error))
    }


    render() {
        const articleStr = this.state.article;
        let singleArticle={};
        if (articleStr) {
            singleArticle=JSON.parse(articleStr);
        }        
        return (
            <div>
                {
                    !singleArticle
                    ?   <p>Could not fetch article</p>
                    :   (singleArticle.article_id)
                        ?   <Fragment>
                                <h3>{singleArticle.title}</h3>
                                <p>
                                    <span>{singleArticle.topic} </span> 
                                    <span>BY: <Link to={`/users/${singleArticle.author}`}> {singleArticle.author} </Link></span>
                                    <span>ON: {singleArticle.created_at}</span>
                                </p>
                                <p>{singleArticle.body}</p>
                                <p>Rating: {singleArticle.votes}</p>
                                <p>Comments: {singleArticle.comment_count}</p>                    
                            </Fragment>                                    
                        :   <p>{singleArticle.msg}</p>
                        
                }
            </div>
        )
    }
}

export default SingleArticle;