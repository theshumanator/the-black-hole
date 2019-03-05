import React, { Component } from 'react';
import {Link} from '@reach/router';
import {getAllArticles} from '../utils/APICalls';
import {Dropdown, DropdownButton} from 'react-bootstrap'

class HomeBody extends Component {

    state = {
        articles: [],
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        reQuery: true
    }

    handleSortSelect = (eventKey) => {
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true});
    }
    componentDidMount () {
        this.fetchArticles();
    }

    componentDidUpdate () {
        if(this.state.reQuery) {
            this.fetchArticles();
        }
        
    }

    fetchArticles () {
        getAllArticles({sort_by: this.state.sortByKey, order: this.state.sortOrder})
        .then((articles) => {
            this.setState({articles: articles, reQuery: false});
        })
        .catch(error => console.log('got : ' + error))
    }

    render() {
        const articleArr = this.state.articles;
        return (
            <div>
                <DropdownButton id="dropdown-basic-button" title="Sort By">
                    <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                    <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                    <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                    <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                    <Dropdown.Item eventKey="topic asc" onSelect={this.handleSortSelect}>Topic (A-Z)</Dropdown.Item>
                    <Dropdown.Item eventKey="topic desc" onSelect={this.handleSortSelect}>Topic (Z-A)</Dropdown.Item>
                </DropdownButton>
                {
                    articleArr &&
                    articleArr.map(article => {                       
                        return (
                            <p key={article.article_id}>{article.topic}: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> {article.created_at}</p>
                        )
                    })
                }
            </div>
        )
    }
}

export default HomeBody;