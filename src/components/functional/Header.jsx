import React, {Component} from 'react';
import '../../main.css';
import {Alert, Container, Row, Col, Button} from 'react-bootstrap';
import LoginForm from '../containers/LoginForm';
import {getUserDetails} from '../../utils/APICalls';

class Header extends Component {

    state = {
        userInput : '',
        loginError: false
    };

    handleChange = (event) => {
        this.setState({ userInput: event.target.value, loginError: false });
    }

    handleLogin = (event) => {
        event.preventDefault()
        getUserDetails(this.state.userInput)
            .then((user) => {
                if (!user) {
                    this.setState({userInput: '', loginError: true});
                } else {
                    localStorage.setItem('userLoggedIn', this.state.userInput);
                    this.setState({loginError: false});                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        this.setState({loginError: false});
    }

    render () {
        return(
            <div className="header">            
                <Container>
                    <Row>
                        <Col xs={6}>
                            <h1>The Black Hole</h1>
                        </Col>
                        <Col>
                            {
                                localStorage.getItem('userLoggedIn')
                                ? <Button variant="primary" onClick={this.handleLogout}>Logout</Button>
                                : <LoginForm handleChange={this.handleChange}  handleLogin={this.handleLogin}/>
                            }
                           
                        </Col>
                    </Row>  
                    <Row>
                        <Col xs={6}/>
                        <Col>
                            {this.state.loginError && <Alert variant='danger'>Invalid username. Try again.</Alert>}
                        </Col>
                        
                    </Row>              
                </Container>
            </div>
        );
    }
    
};

export default Header;


                        /* <Form onSubmit={props.handleLogin}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formBasicUsername">
                                        <Form.Control type="text" placeholder="E.g jessjelly"
                                            name="username" inputRef={ref => { this.myInput = ref; }}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Button variant="primary" type="submit">Login</Button>
                                </Col>
                            </Row>
                        </Form>     */

                        /* <form onSubmit={this.handleAddStudent}>
                            <input type="text" placeholder="Student Name" onChange={this.handleNameChange} value={this.state.studentName}/>
                                    <input type="text" placeholder="Starting Cohort" onChange={this.handleCohortChange} value={this.state.cohort}/>
                            <button>Add Student</button>
                        </form> */
                            