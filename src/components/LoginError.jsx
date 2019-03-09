import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';

const LoginError = ( { loginError } ) => {
    return (
        loginError && 
            <Row>
                <Col className="headerErrorBlankCol"/>
                <Col className="headerErrorCol">
                    <Alert variant='danger' dismissible>Invalid username. Try again.</Alert>
                </Col>
                <Col className="headerErrorBlankCol"/>
            </Row>
    );
};

export default LoginError;