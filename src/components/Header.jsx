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
        isActionLoginOut: false,
        screenSize: window.innerHeight<600?'sm':window.innerHeight>1200?'lg':''
    };

    handleChange = (event) => {
        this.setState({ userInput: event.target.value, loginError: false, isActionLoginOut: false });
    }

    handleLogin = (event) => {
        event.preventDefault()
        getUserDetails(this.state.userInput)
            .then((user) => {                
                if (user.status) {
                    this.setState({userInput: '', loginError: true, isActionLoginOut: false});
                } else {
                    localStorage.setItem('userLoggedIn', this.state.userInput);
                    localStorage.setItem('userName', user.name);
                    localStorage.setItem('userAvatar', user.avatar_url);
                    this.setState({loginError: false, isActionLoginOut: true, userInput: ''});                    
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

    handleScreenResize = () => {        
        this.setState({
            screenSize: window.innerHeight<600?'sm':window.innerHeight>1200?'lg':''
        });
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleScreenResize, false);
    }
    componentDidUpdate () {
        if(this.state.isActionLoginOut) {
            this.setState({isActionLoginOut: false}, () => {
                this.props.updateUser();
            })
        }
    }

    render () {    
        const {screenSize, userInput, showSignupModal, loginError} = this.state;   
        
        return(
            <div className="header">               
                <Container className="headerContainer">
                    <Row>
                        <Col className="headerTitleCol">
                        <Link to={`/`}><h1>The Black Hole</h1></Link>
                        </Col>
                        <Col className="headerLoginCol">
                            {
                                localStorage.getItem('userLoggedIn')
                                    ? <WelcomeUser size={screenSize} handleLogout={this.handleLogout}/>
                                    : <LoginForm size={screenSize} handleChange={this.handleChange}  handleLogin={this.handleLogin} userInput={userInput}/>
                            }                           
                        </Col>
                        {
                            !localStorage.getItem('userLoggedIn')
                            ? <Col className="headerSignupCol">
                                <Button size={screenSize} variant="success" onClick={this.handleShowSignup}>Sign Up</Button>
                                {
                                    showSignupModal && <SignupForm 
                                    showSignupModal={showSignupModal} 
                                    handleSignupClose={this.handleSignupClose}/>
                                }          
                            </Col> 
                            :<Col/>
                        }                      
                        
                    </Row> 
                    {
                        loginError &&                     
                            <Row>
                                <Col className="headerErrorBlankCol"/>
                                <Col className="headerErrorCol">
                                        <Alert variant='danger' dismissible>Invalid username. Try again.</Alert>                          
                                </Col>
                                <Col className="headerErrorBlankCol"/>
                            </Row>
                    }
                    <Row className="headerInfo">
                        <Col/>
                        <Col className="headerInfoCol">
                            {!localStorage.getItem('userLoggedIn') && <Alert variant='primary'>Signup or login to get full functionality (like posting articles and commenting)</Alert>}
                        </Col>
                        <Col/>
                    </Row>                                                               
                </Container>
            </div>
        );
    }
    
};

export default Header;

    