import React, {Component} from 'react';
import {Alert, Container, Row, Col, Button} from 'react-bootstrap';
import {getUserDetails} from '../utils/APICalls';
import {Link} from '@reach/router';
import LoginForm from './LoginForm';
import WelcomeUser from './WelcomeUser';
import SignupForm from './SignupForm';
import '../main.css';

class Header extends Component {

    state = {
        userInput : '',
        loginError: false,
        showSignupModal: false,
        isActionLoginOut: false
    };

    handleChange = (event) => {
        this.setState({ userInput: event.target.value, loginError: false, isActionLoginOut: false });
    }

    handleLogin = (event) => {
        event.preventDefault()
        getUserDetails(this.state.userInput)
            .then((user) => {
                if (!user) {
                    this.setState({userInput: '', loginError: true, isActionLoginOut: false});
                } else {
                    localStorage.setItem('userLoggedIn', this.state.userInput);
                    localStorage.setItem('userName', user.name);
                    localStorage.setItem('userAvatar', user.avatar_url);
                    this.setState({loginError: false, isActionLoginOut: true});                    
                }
            })
            .catch(error => console.log('got : ' + error))
    }

    handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        this.setState({loginError: false, isActionLoginOut: true});
    }

    handleShowSignup = () => {        
        this.setState({ loginError: false, showSignupModal: true, isActionLoginOut: false});
    }

    handleSignupClose = () => {
        console.log('Closing signup')
        this.setState({ showSignupModal: false, isActionLoginOut: true });
    } 
    componentDidUpdate () {
        if(this.state.isActionLoginOut) {
            this.setState({isActionLoginOut: false}, () => {
                this.props.updateUser();
            })
        }
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
                                    : <LoginForm handleChange={this.handleChange}  handleLogin={this.handleLogin} userInput={this.state.userInput}/>
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
                                <Button variant="success" onClick={this.handleShowSignup}>Sign Up</Button>
                                {
                                    this.state.showSignupModal && <SignupForm 
                                    showSignupModal={this.state.showSignupModal} 
                                    handleSignupClose={this.handleSignupClose}/>
                                }          
                            </Col>                        
                        </Row> 
                        :<Row/>
                    } 
                    <Row>
                        <Col>
                            {!localStorage.getItem('userLoggedIn') && <Alert variant='primary'>Signup or login to get full functionality (like posting articles and commenting)</Alert>}
                        </Col>
                    </Row>                                                               
                </Container>
            </div>
        );
    }
    
};

export default Header;

    