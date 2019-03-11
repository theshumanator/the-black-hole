import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ArticleListItem from './ArticleListItem';

const UserDashboardArticleList = ( { articleProps, handleDelete } ) => {
    const { articlesFound, username, screenSize, articles, loggedUser, userStr } = articleProps;
    return (
        <div>  
            {
                articlesFound && articles
                    ? <Row className="articleListRow">
                        <Col xs={9}>
                            {
                                articles.map( ( article, idx ) => {  
                                    return <ArticleListItem size={screenSize} key={idx} article={article} idx={idx} 
                                        loggedUser={loggedUser} username={username} handleDelete={handleDelete}/>;
                                } )                                                                    
                            }                             
                        </Col>
                    </Row>                    
                    : userStr && <h3 className="noResults">No articles found for {username}</h3>
            }            
        </div>
    );
};

export default UserDashboardArticleList;