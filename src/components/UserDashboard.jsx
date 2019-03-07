import React, { Component } from 'react';
import {getAllArticles, deleteArticle} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Row, Col, Button, Breadcrumb} from 'react-bootstrap';
import PrettyDate from './PrettyDate';
import ArticleListItem from './ArticleListItem';

class UserDashboard extends Component {

    state = {
        requestedUser: null,
        articles: [],
        articlesFound: false,
        error: false,
        hasMore: true,
        isLoading: true,
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false,
        pageNum: 1, //default
        articleDeleted: false
    }
    componentDidMount () {
        this.fetchArticles();
    }

    componentDidUpdate (prevProps, prevState) {
        let {pageNum} = this.state;   
        const { requestedUser, pageClicked, articleDeleted } = this.state;       
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasUserChanged = requestedUser!==this.props.username;

        if (hasUserChanged) {                        
            if (pageNum===1){
                this.fetchArticles();
            } else {
                this.setState({pageNum: 1})                
            }                         
        } 
        if (hasPageChanged && pageClicked) {
            this.fetchArticles();
        } 

        if(articleDeleted) {
            this.fetchArticles();
        }


    }

    fetchArticles () {
        let {pageNum, accumCount, prevClicked} = this.state;
        getAllArticles({author: this.props.username, p: pageNum})
            .then(({articles, total_count}) => {                 
                if (!Array.isArray(articles)) {                    
                    this.setState({
                        hasMore: false,                        
                        isLoading: false,
                        pageClicked: pageNum>1?true:false,
                        pageNum: pageNum>1?--pageNum:1,    
                        requestedUser: this.props.username,                         
                        prevClicked: true,
                        articlesFound: false,
                        articleDeleted: false
                    });
                } else {
                    if (!prevClicked) {
                        accumCount+=articles.length
                    }
                    this.setState({                        
                        hasMore: ((this.state.articles.length + articles.length)<total_count),
                        isLoading: false,                        
                        articles,
                        requestedUser: this.props.username,
                        articlesFound: true,
                        pageClicked: false,
                        accumCount: accumCount,
                        totalCount: total_count,
                        prevClicked: true,
                        articleDeleted: false
                    })
                } 
            })
            .catch(error => console.log('got : ' + error)) 
    }

    handleDelete = (articleId) => {        
        deleteArticle(articleId)
            .then((status) => {
                if(status===204) {
                    this.setState(({totalCount, accumCount, articleDeleted}) => ({
                        totalCount: --totalCount,                                                
                        accumCount: --accumCount,
                        articleDeleted: true
                      }));                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }


    handlePageClick = (pageOffset) => {        
        this.setState(({pageNum, accumCount, pageClicked, articles}) => ({
            pageNum: pageNum + pageOffset,
            pageClicked: true,
            prevClicked: pageOffset===-1,
            accumCount: pageOffset===-1?accumCount-articles.length:accumCount
          }));
    }


    render() {        
        const {username, loggedUser} = this.props;
        const articleArr = this.state.articles;
        const {articlesFound, pageNum, accumCount, totalCount, isLoading} = this.state;  
                
        console.log(`In render article arr size: ${articleArr.length}, accumCount ${accumCount} totalCount ${totalCount}`)
        return (
            <div className="articlesList">
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                    
                    <Breadcrumb.Item active>Articles by {username}</Breadcrumb.Item>
                </Breadcrumb>
                {
                    isLoading
                    ?   <h3>Loading...</h3>
                    :   <div>
                        <Row>
                            <Col>
                                <Button onClick={()=>this.handlePageClick(-1)} variant="outline-primary" disabled={pageNum===1 && totalCount>0 || articleArr.length===0}>Previous</Button>
                                <Button onClick={()=>this.handlePageClick(1)} variant="outline-primary" disabled={accumCount===totalCount}>Next</Button>
                            </Col>                        
                        </Row>
                        <Row>
                            <Col xs={9}>
                            {
                                articlesFound
                                    ? articleArr &&
                                            articleArr.map((article, idx) => {  
                                                return <ArticleListItem key={idx} article={article} idx={idx} loggedUser={loggedUser} username={username} handleDelete={this.handleDelete}/>
                                            })                            
                                    :   <p>No articles found for {username}</p> 
                            }                             
                            </Col>
                        </Row>
                        </div>
                }                                      
            </div>
        )
    }
}
export default UserDashboard;


