import React, { Component } from 'react';
import {getAllArticles} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Breadcrumb} from 'react-bootstrap'
import PrettyDate from './PrettyDate';
import { throttle } from "lodash";

class SingleTopic extends Component {
    state = {
        topic: null,
        articles: [],
        articlesFound: true,
        error: false,
        hasMore: true,
        isLoading: true,
        pageNum: 1 //default
    }

    componentDidMount () {
        this.fetchArticles();
        this.addScrollEventListener();
    }

    componentDidUpdate(prevProps, prevState) {
        let {pageNum} = this.state;
        const { hasMore, topic, isLoading } = this.state;        
        const hasPageChanged = prevState.pageNum !== pageNum;
        const hasTopicChanged = topic !== this.props.slug;

        //console.log(hasPageChanged, hasTopicChanged, topic, this.props.slug)
        if (hasPageChanged && hasMore)  {
            this.fetchArticles(pageNum)
        } else if (hasTopicChanged && topic!==null) {
            this.fetchArticles();
        } else if (hasMore && pageNum===1 && !isLoading) {
            this.setState({ pageNum: ++pageNum});
        }
    }

    addScrollEventListener = () => {
        document.querySelector('.articlesByTopic').addEventListener('scroll', this.handleScroll);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = throttle((event) => {     
        let {pageNum} = this.state;   
        const { clientHeight, scrollTop, scrollHeight } = event.target.documentElement;        
        const distanceFromBottom = scrollHeight - (clientHeight + scrollTop);        
        //console.log(distanceFromBottom)
        if (distanceFromBottom < 200) {
          this.setState({ pageNum: ++pageNum});
        }
      }, 500);



    fetchArticles (pageNum=1) {
        this.setState({isLoading: true}, () => getAllArticles({topic: this.props.slug, p: pageNum})
               .then(({articles, total_count}) => {     
                    if (!Array.isArray(articles)) {
                        this.setState({
                            isLoading: false,
                            hasMore: false,
                            articles: [], 
                            pageNum,
                            topic: this.props.slug, 
                            articlesFound: false});
                    } else {
                        this.setState({
                            hasMore: ((this.state.articles.length + articles.length)<total_count),     isLoading: false,
                            articles: pageNum!==1?[...this.state.articles, ...articles]:articles,
                            topic: this.props.slug,
                            articlesFound: true,                            
                            //pageNum: pageNum
                        })
                    }                                    
                })
                .catch(error => console.log('got : ' + error)) )

    }

    render () {
        const slug = this.props.slug;
        const articleArr = this.state.articles;
        const {hasMore, isLoading, articlesFound} = this.state;     

        return (
            <div className="articlesByTopic">
                {/* <h3>Articles on topic: {slug}</h3> */}
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                    
                    <Breadcrumb.Item active>Articles on topic: {slug}</Breadcrumb.Item>
                </Breadcrumb>
                {
                    isLoading
                    ? <h3>Loading...</h3>
                    : <div>
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
                            {!hasMore && articlesFound &&
                                <h3>You did it! You reached the end!</h3>
                            } 
                    </div>   
                                    
                }
                
            </div>
        )
    }
}

export default SingleTopic;