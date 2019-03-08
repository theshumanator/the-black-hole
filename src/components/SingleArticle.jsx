import React, { Component } from 'react';
import {Link, navigate} from '@reach/router';
import {Button, Breadcrumb} from 'react-bootstrap'
import {getArticleById, updateVote, deleteArticle} from '../utils/APICalls';
import ArticleComments from './ArticleComments';
import PrettyDate from './PrettyDate';

class SingleArticle extends Component {

    state = {
        article: null,
        userVoted: false,
        screenSize: window.innerHeight<600?'sm':window.innerHeight>1200?'lg':''
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleScreenResize, false);
        getArticleById(this.props.articleId)
            .then((article) => { 
                this.setState({article: JSON.stringify(article)});
                
            })
            .catch(error => console.log('got : ' + error))
    }

    handleScreenResize = () => {        
        this.setState({
            screenSize: window.innerHeight<600?'sm':window.innerHeight>1200?'lg':''            
        });
    }

    handleVote = (voteVal) => {        
        updateVote(this.props.articleId, {inc_votes: voteVal})
            .then((article) => { 
                this.setState({article: JSON.stringify(article), userVoted: true});                
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
        const {userVoted, screenSize} = this.state;    
        const {loggedUser} = this.props;
        let singleArticle={};
        if (articleStr) {
            singleArticle=JSON.parse(articleStr);
        }                     
        return (
            <div>  
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                    
                    <Breadcrumb.Item active>Article Details</Breadcrumb.Item>
                </Breadcrumb>                          
                {
                    !singleArticle
                    ?   <p>Could not fetch article</p>
                    :   (singleArticle.article_id)
                        ?   <div className="singleArticle">
                                <h3>{singleArticle.title}</h3>
                                <p className="articleListItemTopic"><Link to={`/topics/${singleArticle.topic}`} className="articleListItemTopic">{singleArticle.topic}</Link></p>
                                <p className="articleListItemAuthor"><Link to={`/users/${singleArticle.author}`} className="articleListItemAuthor">{singleArticle.author}</Link></p>
                                <p><PrettyDate dateType="longDate" created_at={singleArticle.created_at}/></p>                                
                                <p>{singleArticle.body}</p>                                
                                {
                                    loggedUser === singleArticle.author && <Button size={screenSize} variant="danger"  onClick={this.handleDelete} className="deleteArticleButton">Delete article</Button>
                                }
                                <p className="voteRequest">Tell us what you think of this article</p>
                                <p><span className="likesItem">(Dis)Likes: </span><span>{singleArticle.votes}</span></p>
                                {loggedUser && <Button size={screenSize} className = "commentLikeButton" disabled={userVoted} variant="outline-success" onClick={()=>this.handleVote(1)}>I like it</Button>}
                                {loggedUser && <Button size={screenSize} className = "commentLikeButton prevNextGap" disabled={userVoted} variant="outline-danger" onClick={()=>this.handleVote(-1)}>I loathe it</Button> }                                 
                                <ArticleComments size={screenSize} article={singleArticle} loggedUser={loggedUser}/>                                                   
                            </div>                                    
                        :   <p>{singleArticle.msg}</p>                        
                }
            </div>
        )
    }
}

export default SingleArticle;