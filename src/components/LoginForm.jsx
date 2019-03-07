import React from 'react';
import '../main.css';
import {Form, Button, Row, Col, FormGroup, FormControl} from 'react-bootstrap';


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
                                <Button variant="primary" type="submit" disabled={props.userInput===''}>Login</Button>
                            </Col>
                        </Row>                                                
                    </FormGroup>
                </Form>                
            </div>
        )    
}

export default LoginForm;