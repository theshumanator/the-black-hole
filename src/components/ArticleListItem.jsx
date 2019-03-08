import React from 'react';
import {Link} from '@reach/router';
import PrettyDate from './PrettyDate';
import '../main.css';
import { Card, Button } from 'react-bootstrap';

const ArticleListItem = (props) => {
    const {idx, article, loggedUser, username} = props;
    return (
         <Card border="dark" key={idx} className="articleListItemCard">
            <Card.Header>
                <Link to={`/topics/${article.topic}`} className="articleListItemTopic">{article.topic}</Link>
            </Card.Header>
            <Card.Body>
                <Card.Title className="articleListItemTitle"><Link className="articleListItemTitle" to={`/articles/${article.article_id}`}>{article.title}</Link></Card.Title>
                <Card.Text>
                    <span className="articleListItemAuthor"><Link to={`/users/${article.author}`}>{article.author}</Link></span>                     
              </Card.Text>
              <Card.Text>                    
                    <PrettyDate dateType="longDate" created_at={props.article.created_at}/>
              </Card.Text>
                {   loggedUser && username && loggedUser === username &&                        
                    <Button size={props.size} variant="danger" onClick={()=>props.handleDelete(article.article_id)}>Delete article</Button>
                }
            </Card.Body>
        </Card>


    )
}
export default ArticleListItem;