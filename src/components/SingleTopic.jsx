import React, { Component } from 'react';
import {getAllArticles} from '../utils/APICalls';
import {Link} from '@reach/router';
import {Breadcrumb} from 'react-bootstrap'
import PrettyDate from './PrettyDate';

class SingleTopic extends Component {
    state = {
        topic: null,
        articles: [],
        articlesFound: true,
        error: false,
        hasMore: true,
        loadMore: false,
        isLoading: false,
        pageNum: 1 //default
    }

    componentDidMount () {
        this.fetchArticles();
    }

    componentDidUpdate() {
        if (this.state.topic!==this.props.slug && !this.state.isLoading) {            
            this.fetchArticles();
        } else if (this.state.loadMore && !this.state.isLoading) {
            this.handleScroll()            
        }
    }

    componentWillMount () {              
        //console.log('adding scroll to event listener')
        window.addEventListener('scroll', this.handleScroll);        
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    handleScroll = (event) => {        
        //console.log('handleScroll')        
        const {error,isLoading,hasMore,pageNum, loadMore} = this.state;
        if (error || isLoading || (!hasMore && !loadMore)) return;
        //console.log(window.innerHeight, document.documentElement.scrollTop, 
          //  document.documentElement.scrollHeight , document.documentElement.offsetHeight) 
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
            console.log(`Load more? ${loadMore} & has more? ${hasMore}`)
            if (hasMore) {                
                localStorage.setItem('currScrollHeight', document.documentElement.scrollTop);              
                this.fetchArticles(pageNum+1);
            } else {
                console.log('Reached end and no more available')
            }            
        } 
    }

    fetchArticles (pageNum=1) {
        this.setState({isLoading: true}, () => getAllArticles({topic: this.props.slug, p: pageNum})
               .then(({articles, total_count}) => {     
                    if (!Array.isArray(articles)) {
                        this.setState({
                            isLoading: false,
                            hasMore: false,
                            loadMore: false,
                            articles: [], 
                            topic: this.props.slug, 
                            articlesFound: false});
                    } else {
                        this.setState({
                            hasMore: ((this.state.articles.length + articles.length)<total_count),
                            loadMore: (this.state.articles.length!==total_count),
                            isLoading: false,
                            articles: pageNum!==1?[...this.state.articles, ...articles]:articles,
                            topic: this.props.slug,
                            articlesFound: true,                            
                            pageNum: pageNum
                        }, () => {
                            if (localStorage.getItem('currScrollHeight')) {
                                document.documentElement.scrollTop = localStorage.getItem('currScrollHeight');
                                localStorage.removeItem('currScrollHeight');
                            }
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
            <div>
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