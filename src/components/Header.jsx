import React, {Component} from 'react';
import {Alert, Container, Row, Col, Button} from 'react-bootstrap';
import {getUserDetails} from '../utils/APICalls';
import {Link} from '@reach/router';
import LoginForm from './LoginForm';
import WelcomeUser from './WelcomeUser';
import SignupForm from './SignupForm';
import NewTopicForm from './NewTopicForm';
import '../main.css';

class Header extends Component {

    state = {
        userInput : '',
        loginError: false,
        showSignupModal: false,
        showNewTopicModal: false        
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
                    localStorage.setItem('userName', user.name);
                    localStorage.setItem('userAvatar', user.avatar_url);
                    this.setState({loginError: false});                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        this.setState({loginError: false});
    }

    handleShowSignup = () => {        
        this.setState({ loginError: false, showSignupModal: true });
    }

    handleSignupClose = () => {
        console.log('Closing signup')
        this.setState({ showSignupModal: false });
    } 

    handleShowNewTopic = () => {
        console.log('bringing up new modal')
        this.setState({ showNewTopicModal: true });
    }

    handleNewTopicClose = () => {
        console.log('Closing new topic modal')
        this.setState({ showNewTopicModal: false });
    } 

    render () {        
        return(
            <div className="header">               
                <Container>
                    <Row>
                        <Col xs={6}>
                        <Link to={`/`}><h1>The Black Hole</h1></Link>
                        </Col>
                        <Col>
                            {
                                localStorage.getItem('userLoggedIn')
                                    ? <WelcomeUser handleLogout={this.handleLogout}/>
                                    : <LoginForm handleChange={this.handleChange}  handleLogin={this.handleLogin}/>
                            }                           
                        </Col>
                        <Col>
                            {this.state.loginError && <Alert variant='danger' dismissible>Invalid username. Try again.</Alert>}
                        </Col>
                    </Row>  
                    {
                        !localStorage.getItem('userLoggedIn')
                        ?<Row>
                            <Col xs={6}/>
                            <Col>                            
                                <p>New user?</p>                            
                            </Col>
                            <Col>
                                <Button variant="success" onClick={this.handleShowSignup}>Sign Up</Button>
                                {
                                    this.state.showSignupModal && <SignupForm 
                                    showSignupModal={this.state.showSignupModal} 
                                    handleSignupClose={this.handleSignupClose}/>
                                }          
                            </Col>                        
                        </Row> 
                        :<Row>
                            <Button variant="primary" onClick={this.handleShowNewTopic}>Create a new topic</Button>
                            {
                                this.state.showNewTopicModal && <NewTopicForm
                                    showNewTopicModal={this.state.showNewTopicModal}
                                    handleNewTopicClose={this.handleNewTopicClose}
                                />
                            }
                            <Button variant="primary">Create a new article</Button>
                        </Row>
                    }                                           
                </Container>
            </div>
        );
    }
    
};

export default Header;

    