import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import PrettyDate from './PrettyDate';
import '../main.css';
import { Card, Button } from 'react-bootstrap';

const ArticleListItem = ( { idx, article, loggedUser, username , handleDelete, size } ) => {
    
    return (
        <Card border="dark" key={idx} className="articleListItemCard">
            <Card.Header>
                <Link to={`/topics/${ article.topic }`} className="articleListItemTopic">{article.topic}</Link>
            </Card.Header>
            <Card.Body>
                <Card.Title className="articleListItemTitle"><Link className="articleListItemTitle" to={`/articles/${ article.article_id }`}>{article.title}</Link></Card.Title>
                <Card.Text>
                    <span className="articleListItemAuthor"><Link to={`/users/${ article.author }`}>{article.author}</Link></span>                     
                </Card.Text>
                <Card.Text>                    
                    <PrettyDate dateType="longDate" created_at={article.created_at}/>
                </Card.Text>
                { loggedUser && username && loggedUser === username &&                        
                    <Button size={size} variant="danger" onClick={() => handleDelete( article.article_id )}>Delete article</Button>
                }
            </Card.Body>
        </Card>

    );
};

ArticleListItem.propTypes = {
    handleDelete: PropTypes.func,
    idx: PropTypes.number,
    article: PropTypes.object,
    loggedUser: PropTypes.string,
    username: PropTypes.string,
    size: PropTypes.string,    
};

export default ArticleListItem;