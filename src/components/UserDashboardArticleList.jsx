import React from 'react';
import { Row, Button, Col } from 'react-bootstrap';
import ArticleListItem from './ArticleListItem';

const UserDashboardArticleList = ( { articleProps, handlePageClick, handleDelete } ) => {
    const { articlesFound, username, screenSize, pageNum, articleArr, accumCount, totalCount, loggedUser, userStr } = articleProps;
    const disablePrevButton = pageNum === 1 || articleArr.length === 0;
    const disableNextButton = accumCount === totalCount;
    return (
        <div>  
            {
                articlesFound && articleArr
                    ? <>
                    <Row className="browseFuncsRow">     
                        <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => handlePageClick( -1 )} 
                            variant="outline-primary" disabled={disablePrevButton}>Previous</Button>                                        
                        <Button size={screenSize} className="prevNextButton prevNextGap" onClick={() => handlePageClick( 1 )} 
                            variant="outline-primary" disabled={disableNextButton}>Next</Button>                       
                    </Row>
                    <Row className="articleListRow">
                        <Col xs={9}>
                            {
                                articleArr.map( ( article, idx ) => {  
                                    return <ArticleListItem size={screenSize} key={idx} article={article} idx={idx} 
                                        loggedUser={loggedUser} username={username} handleDelete={handleDelete}/>;
                                } )                                                                    
                            }                             
                        </Col>
                    </Row>
                    </>
                    : userStr && <h3 className="noResults">No articles found for {username}</h3>
            }
            
        </div>
    );
};

export default UserDashboardArticleList;