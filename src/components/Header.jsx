import React, {Component} from 'react';
import '../main.css';
import {Alert, Container, Row, Col, Button} from 'react-bootstrap';
import LoginForm from './LoginForm';
import {getUserDetails, createNewUser} from '../utils/APICalls';
import WelcomeUser from './WelcomeUser';
import SignupForm from './SignupForm';
import {Link} from '@reach/router';
import NewTopicForm from './NewTopicForm';

class Header extends Component {

    state = {
        userInput : '',
        loginError: false,
        showSignupModal: false,
        showNewTopicModal: false,
        inputUsername: '',
        inputName: '',
        inputAvatar: 'https://s-media-cache-ak0.pinimg.com/564x/39/62/ec/3962eca164e60cf46f979c1f57d4078b.jpg', //setting a default avatar
        
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
        this.setState({ showSignupModal: true });
    }

    handleSignupClose = () => {
        console.log('Closing signup')
        this.setState({ showSignupModal: false });
    } 

    handleSignup = () => {
        if (this.state.inputUsername==='' || this.state.inputName==='') {
            console.log('either username or name are blank')
            //TODO alert
        } else {
            const newUser = {
                username: this.state.inputUsername, 
                name: this.state.inputName, 
                avatar_url: this.state.inputAvatar
            };

            createNewUser(newUser)
                .then((data) => {
                    if ('user' in data) {
                        localStorage.setItem('userLoggedIn', data.user.username);
                        localStorage.setItem('userName', data.user.name);
                        localStorage.setItem('userAvatar', data.user.avatar_url);
                        this.setState({showSignupModal: false});                         
                    } else {
                        console.log('User couldnt be added : ' + data.msg)
                        //TODO alert user.msg                        
                    }
                })
                .catch(error => console.log('got : ' + error))
        }
    }

    handleUsernameChange = (event) => {
        this.setState({ inputUsername: event.target.value});
    }

    handleNameChange = (event) => {
        this.setState({ inputName: event.target.value});   
    }

    handleAvatarChange = (event) => {
        this.setState({ inputAvatar: event.target.value});
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
                            {this.state.loginError && <Alert variant='danger'>Invalid username. Try again.</Alert>}
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
                                {this.state.showSignupModal && <SignupForm 
                                    showSignupModal={this.state.showSignupModal} 
                                    handleSignupClose={this.handleSignupClose} 
                                    handleSignup={this.handleSignup} 
                                    handleAvatarChange={this.handleAvatarChange} 
                                    handleNameChange={this.handleNameChange} 
                                    handleUsernameChange={this.handleUsernameChange}/>}          
                            </Col>                        
                        </Row> 
                        :<Row>
                            <Button variant="primary" onClick={this.handleShowNewTopic}>Create a new topic</Button>
                            {
                                this.state.showNewTopicModal && <NewTopicForm
                                    showNewTopicModal={this.state.showNewTopicModal}
                                    handleNewTopicClose={this.handleNewTopicClose}
                                    handleAddNewTopic={this.handleAddNewTopic}
                                    handleTopicSlugChange={this.handleTopicSlugChange}
                                    handleTopicDescriptionChange={this.handleTopicDescriptionChange}
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

    