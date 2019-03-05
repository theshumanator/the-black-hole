import React, { Component, Fragment} from 'react';
import {Link} from '@reach/router';
import {getAllArticles} from '../utils/APICalls';
import {Dropdown, DropdownButton, Row, Col, Button} from 'react-bootstrap'
import NewTopicForm from './NewTopicForm';
import NewArticleForm from './NewArticleForm';

class HomeBody extends Component {

    state = {
        articles: [],
        sortByKey: 'created_at', //default
        sortOrder: 'desc', //default
        reQuery: true,
        showNewTopicModal: false,
        showNewArticleModal: false
    }

    handleSortSelect = (eventKey) => {
        const sortArr = eventKey.split(' ');
        this.setState({sortByKey: sortArr[0], sortOrder: sortArr[1], reQuery: true});
    }

    handleShowNewTopic = () => {
        console.log('bringing up new modal')
        this.setState({ showNewTopicModal: true, reQuery: false });
    }

    handleNewTopicClose = () => {
        console.log('Closing new topic modal')
        this.setState({ showNewTopicModal: false, reQuery: false });
    } 

    handleShowNewArticle = () => {
        console.log('bringing up new modal')
        this.setState({ showNewArticleModal: true, reQuery: false });
    }

    handleNewArticleClose = () => {
        console.log('Closing new articl modal')
        this.setState({ showNewArticleModal: false, reQuery: true });
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
        const loggedUser = this.props.loggedUser;
        console.log('loggedUser in homebody' + loggedUser);
        return (    
            <div>
                <Row>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title="Sort By" variant='secondary'>
                            <Dropdown.Item eventKey="created_at desc" onSelect={this.handleSortSelect}>Newest (Default)</Dropdown.Item>
                            <Dropdown.Item eventKey="created_at asc" onSelect={this.handleSortSelect}>Oldest</Dropdown.Item>
                            <Dropdown.Item eventKey="votes desc" onSelect={this.handleSortSelect}>Highest rated</Dropdown.Item>
                            <Dropdown.Item eventKey="votes asc" onSelect={this.handleSortSelect}>Lowest rated</Dropdown.Item>
                            <Dropdown.Item eventKey="topic asc" onSelect={this.handleSortSelect}>Topic (A-Z)</Dropdown.Item>
                            <Dropdown.Item eventKey="topic desc" onSelect={this.handleSortSelect}>Topic (Z-A)</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    

                    {
                        loggedUser
                        ?   <Fragment>
                                 <Col>
                                    <Button variant="primary" onClick={this.handleShowNewTopic}>Create a new topic</Button>
                                    {
                                        this.state.showNewTopicModal && <NewTopicForm
                                        showNewTopicModal={this.state.showNewTopicModal}
                                        handleNewTopicClose={this.handleNewTopicClose}
                                    />
                                    }
                                </Col>
                                <Col>
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
                
                {
                    articleArr &&
                    articleArr.map(article => {                       
                        return (
                            <p key={article.article_id}><Link to={`/topics/${article.topic}`}>{article.topic}</Link>: <Link to={`/articles/${article.article_id}`}>{article.title}</Link> 
                            <span> BY: <Link to={`/users/${article.author}`}>{article.author}</Link></span> 
                            {article.created_at}
                            </p>
                        )
                    })
                }
            </div>
        )
    }
}

export default HomeBody;

