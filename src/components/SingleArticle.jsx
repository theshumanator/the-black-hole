import React, { Component, Fragment } from 'react';
import {Link, navigate} from '@reach/router';
import {Button} from 'react-bootstrap'
import {getArticleById, updateVote, deleteArticle} from '../utils/APICalls';
import ArticleComments from './ArticleComments';

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

    handleVote = (voteVal) => {        
        updateVote(this.props.articleId, {inc_votes: voteVal})
            .then((article) => { 
                this.setState({article: JSON.stringify(article)});                
            })
            .catch(error => console.log('got : ' + error))
    }

    handleDelete = () => {
        deleteArticle(this.props.articleId)
            .then((status) => {
                if(status===204) {
                    navigate('/');
                }
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
                                <span>Rating: {singleArticle.votes}</span>
                                <p>
                                    <Button variant="outline-success" size="sm" onClick={()=>this.handleVote(1)}>Awesome</Button>
                                    <span> What do you think this article? </span>
                                    <Button variant="outline-danger" size="sm" onClick={()=>this.handleVote(-1)}>Boring</Button>
                                </p>
                                {
                                    this.props.loggedUser === singleArticle.author && <Button variant="danger" size="sm" onClick={this.handleDelete}>Delete article</Button>
                                }
                                <ArticleComments article={singleArticle} loggedUser={this.props.loggedUser}/>                                                   
                            </Fragment>                                    
                        :   <p>{singleArticle.msg}</p>                        
                }
            </div>
        )
    }
}

export default SingleArticle;