import React, { Component } from 'react';
import {getAllArticles, deleteArticle} from '../utils/APICalls';
import {Row, Col, Button} from 'react-bootstrap';
import ArticleListItem from './ArticleListItem';
import BreadCrumb from './BreadCrumb';

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
        articleDeleted: false,
        screenSize: window.innerHeight<600?'sm':window.innerHeight>1200?'lg':''
    }
    componentDidMount () {
        window.addEventListener('resize', this.handleScreenResize, false);
        this.fetchArticles();
    }

    componentDidUpdate (prevProps, prevState) {
        let {pageNum} = this.state;   
        const { requestedUser, pageClicked, articleDeleted, screenSize } = this.state;       
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasScreenChanged = prevState.screenSize !== screenSize;
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

        if(articleDeleted || hasScreenChanged) {
            this.fetchArticles();
        }
    }

    handleScreenResize = () => {        
        this.setState({
            screenSize: window.innerHeight<600?'sm':window.innerHeight>1200?'lg':''
        });
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
                    if (pageNum===1) {
                        accumCount=articles.length;
                    } else if (!prevClicked) {
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
                        prevClicked: false,
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
                    this.setState(({totalCount, accumCount}) => ({
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
        const {articlesFound, pageNum, accumCount, totalCount, isLoading, screenSize} = this.state;  
        console.log(`Total count ${totalCount} accumCount ${accumCount} pageNum ${pageNum}`)        
        return (
            <div className="articlesList">
                <BreadCrumb currentPage={`Articles by: ${username}`}/>
                
                {
                    isLoading
                    ?   <h3>Loading...</h3>
                    :   articlesFound && articleArr
                        ?   <div>                            
                                <Row className="browseFuncsRow">     
                                    <Button size={screenSize} className="prevNextButton prevNextGap" onClick={()=>this.handlePageClick(-1)} variant="outline-primary" disabled={pageNum===1 || articleArr.length===0}>Previous</Button>                                        
                                    <Button size={screenSize} className="prevNextButton prevNextGap" onClick={()=>this.handlePageClick(1)} variant="outline-primary" disabled={accumCount===totalCount}>Next</Button>                       
                                </Row>
                                <Row className="articleListRow">
                                    <Col xs={9}>
                                    {
                                        articleArr.map((article, idx) => {  
                                            return <ArticleListItem size={screenSize} key={idx} article={article} idx={idx} loggedUser={loggedUser} username={username} handleDelete={this.handleDelete}/>
                                        })                                                                    
                                    }                             
                                    </Col>
                                </Row>
                            </div>
                        :   <h3 className="noResults">No articles found for {username}</h3>                                         
                }                                      
            </div>
        )
    }
}
export default UserDashboard;


