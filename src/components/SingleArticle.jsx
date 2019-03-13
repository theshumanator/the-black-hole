import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from '@reach/router';
import { Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import ArticleComments from './ArticleComments';
import PrettyDate from './PrettyDate';
import BreadCrumb from './BreadCrumb';
import VotingButtons from './VotingButtons';
import axios from 'axios';

class SingleArticle extends Component {

    //avoid memory leak cancel all axios requests, etc
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
    _isMounted = false;
    
    state = {
        article: null,
        userVoted: false,        
        deleteError: false,        
        screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
    }

    componentWillUnmount() {
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        window.removeEventListener( 'resize', this.handleScreenResize, false ); this._isMounted = false;
    }
    componentDidMount () {
        this._isMounted = true;
        window.addEventListener( 'resize', this.handleScreenResize, false );
        const { articleId } = this.props;
        const apiObj = {
            url: `/articles/${ articleId }`,
            reqObjectKey: 'article',
            method: 'get',
            cancelToken: this.source.token
        };

        this._isMounted && makeAPICalls( apiObj )
            .then( ( article ) => { 
                this.setState( { article: JSON.stringify( article ) } );
                
            } )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { article: null } );
                }                
            } );
    }

    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''            
        } );
    }

    handleVote = ( voteVal ) => {      
        const data = { inc_votes: voteVal };
        const { articleId } = this.props;
        const apiObj = {
            url: `/articles/${ articleId }`,
            reqObjectKey: 'article',
            method: 'patch',
            data,
            cancelToken: this.source.token
        };
        this._isMounted && makeAPICalls( apiObj )
            .then( ( article ) => this.setState( { article: JSON.stringify( article ), userVoted: true } ) )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { article: null, userVoted: false } );
                }                
            } );
    }

    handleDelete = () => {
        const { articleId } = this.props;
        const apiObj = {
            url: `/articles/${ articleId }`,
            reqObjectKey: 'status',
            method: 'delete',
            cancelToken: this.source.token            
        };

        this._isMounted && makeAPICalls( apiObj )
            .then( ( status ) => {
                if ( status === 204 ) {
                    navigate( '/' );
                }
            } )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { deleteError: true } ); 
                }
            } );
    }

    render() {
        const articleStr = this.state.article;  
        const { userVoted, screenSize,deleteError } = this.state;    
        const { loggedUser, articleId } = this.props;
        let singleArticle = {};
        if ( articleStr ) {
            singleArticle = JSON.parse( articleStr );
        }                     
        return (
            <div>  
                <BreadCrumb currentPage="Article Details"/>                
                {
                    !singleArticle || articleStr === null
                        ? <h3 className="noResults">Could not fetch article with id: {articleId}</h3>
                        : ( singleArticle.article_id )
                            ? <div data-cy="singleArticle" className="singleArticle">
                                <h3>{singleArticle.title}</h3>
                                <p className="articleListItemTopic"><Link to={`/topics/${ singleArticle.topic }`} className="articleListItemTopic">{singleArticle.topic}</Link></p>
                                <p className="articleListItemAuthor"><Link to={`/users/${ singleArticle.author }`} className="articleListItemAuthor">{singleArticle.author}</Link></p>
                                <p><PrettyDate dateType="longDate" created_at={singleArticle.created_at}/></p>                                
                                <div className="singleArticleBodyDiv">
                                    <>{singleArticle.body}</>
                                </div>                                
                                {
                                    loggedUser === singleArticle.author && <Button size={screenSize} variant="danger" onClick={this.handleDelete} className="deleteArticleButton">Delete article</Button>
                                }
                                <p className="voteRequest">Tell us what you think of this article</p>
                                <p><span className="likesItem">(Dis)Likes: </span><span data-cy="cyArticleVotes" >{singleArticle.votes}</span></p>
                                {loggedUser && <VotingButtons size={screenSize} userVoted={userVoted} upVote="I like it" downVote="I loathe it" handleVote={this.handleVote}/>}                           
                                <ArticleComments size={screenSize} article={singleArticle} loggedUser={loggedUser}/>                                                   
                            </div>                                    
                            : <p>{singleArticle.msg}</p>                        
                }
                {deleteError && <p className="noResults">Could not delete article</p>}
            </div>
        );
    }
}

SingleArticle.propTypes = {
    articleId: PropTypes.string,
    loggedUser: PropTypes.string
};

export default SingleArticle;