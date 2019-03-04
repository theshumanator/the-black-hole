import React, { Component } from 'react';
import { Alert, Form, Button, Row, Col, FormGroup, FormControl} from 'react-bootstrap';


const LoginForm = (props) => {

 
        return (
            <div>
                <Form onSubmit={props.handleLogin}>
                    <FormGroup controlId="username">
                        <Row>
                            <Col>
                                <FormControl type="text" placeholder="E.g jessjelly" 
                                onChange={props.handleChange}/>
                            </Col>
                            <Col>
                                <Button variant="primary" type="submit">Login</Button>
                            </Col>
                        </Row>                                                
                    </FormGroup>
                </Form>                
            </div>
        )
    
}

export default LoginForm;