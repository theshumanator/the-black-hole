import React from 'react';
import PropTypes from 'prop-types';
import '../main.css';
import { Form, Button, Row, Col, FormGroup, FormControl } from 'react-bootstrap';

const LoginForm = ( { handleLogin, handleChange, size, userInput } ) => {
 
    return (
        <div>
            <Form onSubmit={handleLogin}>
                <FormGroup controlId="username">
                    <Row>
                        <Col>
                            <FormControl type="text" placeholder="E.g shumi" 
                                onChange={handleChange}/>
                        </Col>
                        <Col>
                            <Button size={size} variant="primary" type="submit" disabled={userInput === ''}>Login</Button>
                        </Col>
                    </Row>                                                
                </FormGroup>
            </Form>                
        </div>
    );    
};

LoginForm.propTypes = {
    handleLogin: PropTypes.func,
    handleChange: PropTypes.func,
    idx: PropTypes.number,
    userInput: PropTypes.string,
    size: PropTypes.string,    
};

export default LoginForm;