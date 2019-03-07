import React, { Component } from 'react';
import {getAllArticles} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Breadcrumb, Button, Col, Row} from 'react-bootstrap'
import PrettyDate from './PrettyDate';
/* import { throttle } from "lodash";
import { render } from "react-dom";
import InfiniteScroll from "react-infinite-scroll-component"; */


class SingleTopic extends Component {
    state = {
        topic: null,
        articles: [],
        articlesFound: true,
        error: false,
        hasMore: true,
        isLoading: true,
        pageClicked: false,
        totalCount: 0,
        accumCount: 0,
        prevClicked: false,
        pageNum: 1 //default
        
    }

    componentDidMount () {
        this.fetchArticles();
        //this.addScrollEventListener();
    }

    componentDidUpdate(prevProps, prevState) {        
        const { pageNum, topic, pageClicked } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasTopicChanged = topic !== this.props.slug;
         
        //console.log(`pageNum is ${pageNum} hasMore ${hasMore}  isLoading ${isLoading} `)
        if (hasTopicChanged && topic!==null) {            
            if (pageNum===1) {
                this.fetchArticles();
            } else {
                this.setState({pageNum: 1})
            }            
        }
        if (hasPageChanged && pageClicked) {
            this.fetchArticles();
        }       
    }

/*     addScrollEventListener = () => {
        document.querySelector('.articlesByTopic').addEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
    } */

/*     handleScroll = throttle((event) => {     
        let {pageNum} = this.state;   
        const { clientHeight, scrollTop, scrollHeight } = event.target.documentElement;        
        const distanceFromBottom = scrollHeight - (clientHeight + scrollTop);   
        
        console.log(`Scroll Height: ${scrollHeight}`)
        console.log(`Scroll Top: ${scrollTop}`)
        console.log(`Client Height: ${clientHeight}`)
        console.log(`Height of scren: ${window.innerHeight}`)
        console.log(`Distance from bottom ${distanceFromBottom}`);

        if (distanceFromBottom < 200) {
            console.log('scrolling')
          this.setState({ pageNum: ++pageNum});
          //this.setState({scrollChange: true})
        }
      }, 500);


 */
    fetchArticles = () => {
        let {pageNum, accumCount, prevClicked} = this.state;
        
        getAllArticles({topic: this.props.slug, p: pageNum})
               .then(({articles, total_count}) => {     
                    if (!Array.isArray(articles)) {
                        this.setState({
                            isLoading: false,
                            hasMore: false,
                            //articles: [], 
                            //pageNum: --pageNum,
                            topic: this.props.slug,
                            pageClicked: false,
                            prevClicked: true,
                            articlesFound: false});
                    } else {
                        if (!prevClicked) {
                            accumCount+=articles.length
                        }
                        this.setState({
                            hasMore: ((accumCount + articles.length)<total_count), 
                            isLoading: false,
                            //articles: pageNum!==1?[...this.state.articles, ...articles]:articles,
                            articles,
                            topic: this.props.slug,                            
                            articlesFound: true,                         
                            //pageNum: ++pageNum
                            pageClicked: false,
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

    render () {
        const slug = this.props.slug;
        const articleArr = this.state.articles;
        const {hasMore, articlesFound, isLoading , accumCount, pageNum, totalCount} = this.state;     
        console.log(`Array length is ${articleArr.length}`);
        console.log(window.innerHeight);
        return (
            <div className="articlesByTopic">
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                    
                    <Breadcrumb.Item active>Articles on topic: {slug}</Breadcrumb.Item>
                </Breadcrumb>

                {
                    isLoading
                    ? <h3>Loading...</h3>
                    : <div>
                        <Row>
                        <Col>
                            <Button onClick={()=>this.handlePageClick(-1)} variant="outline-primary" disabled={pageNum===1 || articleArr.length===0}>Previous</Button>
                            <Button onClick={()=>this.handlePageClick(1)} variant="outline-primary" disabled={accumCount===totalCount}>Next</Button>
                        </Col>                        
                        </Row>
                        {articlesFound
                            ? articleArr &&
                                articleArr.map(article => {                        
                                    return (
                                        <p key={article.article_id}> <Link to={`/articles/${article.article_id}`}>{article.title}</Link> 
                                        <span> BY: <Link to={`/users/${article.author}`}>{article.author}</Link></span> 
                                        <span>ON: <PrettyDate dateType="longDate" created_at={article.created_at}/></span></p>
                                    )
                                })                            
                            :   <p>No articles found for topic: {slug}</p>}                             
                    </div>   
                                    
                }
                
            </div>
        )
    }
}

export default SingleTopic;