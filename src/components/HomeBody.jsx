import React, { Component, Fragment} from 'react';
import {Link, navigate} from '@reach/router';
import {getAllArticles, getAllTopics} from '../utils/APICalls';
import {Dropdown, DropdownButton, Row, Col, Button, Pagination} from 'react-bootstrap'
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';
import TopicsDropdown from './TopicsDropdown';
import PrettyDate from './PrettyDate';
import { throttle } from "lodash";
import ArticleListItem from './ArticleListItem';

class HomeBody extends Component {
      
    state = {
        error: false,
        hasMore: true,
        isLoading: true,
        articles: [],
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        pageNum: 1, //default
        reQuery: false,
        reQueryTopics: false,
        showNewTopicModal: false,
        showNewArticleModal: false,
        topics: [],
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false
    };
      

/*     handleScroll = throttle((event) => {     
        let {pageNum} = this.state;   
        const { clientHeight, scrollTop, scrollHeight } = event.target.documentElement;        
        const distanceFromBottom = scrollHeight - (clientHeight + scrollTop);        
        if (distanceFromBottom < 200) {          
          this.setState({ pageNum: ++pageNum});
        }
      }, 500);
 */
      

    handleFilterSelect = (eventKey) => {
        navigate(`/topics/${eventKey}`);        
    }

    handleSortSelect = (eventKey) => {
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true, articles:[], pageNum: 1});
    }

    handleShowNewTopic = () => {
        //console.log('bringing up new modal')
        this.setState({ showNewTopicModal: true, reQuery: false });
    }

    handleNewTopicClose = () => {
        //console.log('Closing new topic modal')
        this.setState({ showNewTopicModal: false, reQuery: false, reQueryTopics: true });
    } 

    handleShowNewArticle = () => {
        //console.log('bringing up new modal')
        this.setState({ showNewArticleModal: true, reQuery: false });
    }

    handleNewArticleClose = () => {
        //console.log('Closing new articl modal')
        this.setState({ showNewArticleModal: false, reQuery: true, articles:[], pageNum: 1 });
    } 
          
/*     addScrollEventListener = () => {
        document.querySelector('.homeArticlesList').addEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
    } */

    componentDidMount () {           
        this.fetchArticles();
        this.fetchTopics();
        /* this.addScrollEventListener(); */
    }

    
    componentDidUpdate (prevProps, prevState) {   
        /* let {pageNum}=this.state;        
        const {hasMore, reQuery, isLoading, scrollChange } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasRequeryChanged = prevState.reQuery !== reQuery;
        console.log(hasMore, hasPageChanged, pageNum, isLoading)


        const { clientHeight, scrollTop, scrollHeight } = document.documentElement;        
        const distanceFromBottom = scrollHeight - (clientHeight + scrollTop);        
        
        console.log(`Scroll Height: ${document.body.scrollHeight}`)
        console.log(`Height of scren: ${window.innerHeight}`)
        console.log(`Distance from bottom ${distanceFromBottom}`);

        if (reQuery) {
            this.setState({reQuery: false})            
        } else if (hasRequeryChanged) {
            this.fetchArticles();
        } else if (hasPageChanged && hasMore && document.body.scrollHeight<window.innerHeight && distanceFromBottom===0) {
         //&&     (!isLoading || (document.body.scrollHeight<window.innerHeight && distanceFromBottom===0))) {
            console.log('in here')
            //this.setState({pageNum: ++pageNum})
            this.fetchArticles();
        } else if(!hasPageChanged && hasMore && document.body.scrollHeight<window.innerHeight && distanceFromBottom===0){
            console.log('Updating page num')
            this.setState({pageNum: ++pageNum})
        } else if (scrollChange) {
            this.fetchArticles();
        } */        
        
        const {reQuery, pageNum, pageClicked, reQueryTopics} = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        //console.log('prev page' + prevState.pageNum +' and now ' + pageNum)
        if (reQuery) {
            this.setState({pageNum:1, reQuery: false}, () => this.fetchArticles());
        } 
        if (reQueryTopics) {
            this.setState({reQueryTopics: false}, () => this.fetchTopics());
        }
        if (hasPageChanged && pageClicked) {
            //console.log('page has changed from ' + prevState.pageNum +' to ' + pageNum)
            this.fetchArticles();
        }

    }

    fetchTopics () {
        getAllTopics()
            .then((topics) => {
                this.setState({topics})
            })
            .catch(error => console.log('got : ' + error)) 
    }
    fetchArticles = () => {        
        let {pageNum, accumCount, prevClicked} = this.state;
      
        
        getAllArticles({sort_by: this.state.sortByKey, order: this.state.sortOrder, p: pageNum})
                .then(({articles, total_count}) => {                        
                    if (!Array.isArray(articles)) {
                        this.setState({
                            hasMore: false,                        
                            isLoading: false,
                            reQuery: false,
                            pageNum: --pageNum,
                            pageClicked: false,
                            //numOfPages: Math.floor(total_count/10)+1
                            prevClicked: true
                        });
                    } else {
                        //console.log('accum count' + accumCount + ' with length: ' + articles.length)
                        //only chnaging it if it wasnt the prev clicked
                        if (!prevClicked) {
                            accumCount+=articles.length
                        }
                        
                        //console.log('New accum count' + accumCount)
                        this.setState({
                            //hasMore: ((this.state.articles.length + articles.length)<total_count),         
                            hasMore: ((accumCount + articles.length)<total_count),         
                            isLoading: false,
                            //articles: pageNum!==1?[...this.state.articles, ...articles]:articles,
                            articles,
                            reQuery: false,
                            pageClicked: false,
                            //numOfPages: Math.floor(total_count/10)+1,
                            accumCount: accumCount,
                            totalCount: total_count,
                            prevClicked: true
                        })
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
        
        const articleArr = this.state.articles;   
        const { hasMore, isLoading , accumCount, pageNum, totalCount} = this.state;     
        const loggedUser = this.props.loggedUser;    
        
        //console.log(`Current page ${pageNum} and totalCount ${totalCount} hasMore is ${hasMore} accumCount is ${accumCount}`);

        return (    
            <div className="homeArticlesList">
            {                 
                isLoading
                ?  <h3>Loading...</h3>
                : <div>
                    <Row>
                        <Col className="homeBodyFilter" lg={2}>
                            <DropdownButton id="dropdown-basic-button" title="Sort By" variant='primary'>
                                <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                                <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                                <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                                <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                                <Dropdown.Item eventKey="topic asc" onSelect={this.handleSortSelect}>Topic (A-Z)</Dropdown.Item>
                                <Dropdown.Item eventKey="topic desc" onSelect={this.handleSortSelect}>Topic (Z-A)</Dropdown.Item>
                                <Dropdown.Item eventKey="comment_count desc" onSelect={this.handleSortSelect}>Highest comment count</Dropdown.Item>
                                <Dropdown.Item eventKey="comment_count asc" onSelect={this.handleSortSelect}>Lowest comment count</Dropdown.Item>
                            </DropdownButton>
                        </Col>{
                        <Col className="homeBodySort" lg={3}>
                            <TopicsDropdown topics={this.state.topics} handleFilterSelect={this.handleFilterSelect}/>
                        </Col>}

                        {
                            loggedUser
                            ?   <Fragment>
                                    <Col className="homeBodyNewTopic">
                                        <Button variant="primary" onClick={this.handleShowNewTopic}>Create a new topic</Button>
                                        {
                                            this.state.showNewTopicModal && <NewTopicForm
                                            showNewTopicModal={this.state.showNewTopicModal}
                                            handleNewTopicClose={this.handleNewTopicClose}
                                        />
                                        }
                                    </Col>
                                    <Col className="homeBodyNewArticle">
                                        <Button variant="primary" onClick={this.handleShowNewArticle}>Create a new article</Button>
                                        {
                                            this.state.showNewArticleModal && <NewArticleForm
                                            showNewArticleModal={this.state.showNewArticleModal}
                                            handleNewArticleClose={this.handleNewArticleClose}/>
                                        }
                                    </Col>
                                </Fragment>
                            :   <Fragment/>
                        }
                    </Row>
                    <Row>
                        <Col>
                            <Button className="prevNextButton prevNextGap" onClick={()=>this.handlePageClick(-1)} variant="outline-primary" disabled={pageNum===1 || articleArr.length===0}>Previous</Button>
                            <Button className="prevNextButton prevNextGap" onClick={()=>this.handlePageClick(1)} variant="outline-primary" disabled={accumCount===totalCount}>Next</Button>
                        </Col>                        
                    </Row>
                    <Row className="articleListRow">
                        {/* <Col className="permButton">                         
                            <Button onClick={()=>this.handlePageClick(-1)} variant="outline-primary" disabled={pageNum===1 || articleArr.length===0}>Previous</Button>                            
                        </Col> */}
                        <Col xs={9} className="articleListItem">                            
                            {articleArr && <div className="articlesList">
                            {articleArr.map((article, idx) => {                       
                                return <ArticleListItem key={idx} article={article} idx={idx}/>
                            })}</div>
                            
                            } 
                        </Col>
                        {/* <Col className="permButton">                         
                            <Button onClick={()=>this.handlePageClick(1)} variant="outline-primary" disabled={accumCount===totalCount}>Next</Button>
                        </Col> */}
                    </Row>                                        
                </div>
            
            }
            </div>
        )
    }
}

export default HomeBody;

