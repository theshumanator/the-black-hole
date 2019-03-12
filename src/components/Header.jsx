import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Container, Row, Col, Button } from 'react-bootstrap';
import { makeAPICalls } from '../utils/APICalls';
import { Link } from '@reach/router';
import LoginForm from './LoginForm';
import WelcomeUser from './WelcomeUser';
import SignupForm from './SignupForm';
import '../main.css';
import LoginError from './LoginError';
import axios from 'axios';

class Header extends Component {

    //avoid memory leak cancel all axios requests, etc
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();
    _isMounted = false;

    state = {
        userInput: '',
        loginError: false,        
        showSignupModal: false,
        isActionLoginOut: false,
        screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
    };

    handleChange = ( event ) => {
        this.setState( { userInput: event.target.value, loginError: false, isActionLoginOut: false } );
    }

    handleLogin = ( event ) => {
        event.preventDefault();   
        const { userInput } = this.state;    
        const apiObj = {
            url: `/users/${ userInput }`,
            reqObjectKey: 'user',
            cancelToken: this.source.token,
            method: 'get'
        }; 
        this._isMounted && makeAPICalls( apiObj )
            .then( ( user ) => {                      
                localStorage.setItem( 'userLoggedIn', userInput );
                localStorage.setItem( 'userName', user.name );
                localStorage.setItem( 'userAvatar', user.avatar_url );
                this.setState( { loginError: false, isActionLoginOut: true, userInput: '' } );           
            } )
            .catch( ( err ) => {                          
                if ( !axios.isCancel( err ) ) {
                    this.setState( { userInput: '', loginError: true, isActionLoginOut: false } );
                }                
            } );
    }

    handleLogout = () => {
        localStorage.removeItem( 'userLoggedIn' );
        localStorage.removeItem( 'userName' );
        localStorage.removeItem( 'userAvatar' );
        this.setState( { loginError: false, isActionLoginOut: true } );
    }

    handleShowSignup = () => {        
        this.setState( { loginError: false, showSignupModal: true, isActionLoginOut: false } );
    }

    handleSignupClose = () => {        
        this.setState( { showSignupModal: false, isActionLoginOut: true } );
    } 

    handleScreenResize = () => {        
        this.setState( {
            screenSize: window.innerHeight < 600 ? 'sm' : window.innerHeight > 1200 ? 'lg' : ''
        } );
    }

    handleNewUserAdded = () => {
        this.setState( { showSignupModal: false }, () => this.props.handleNewUserAdded() );
    }
    
    componentWillUnmount () {
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        window.removeEventListener( 'resize', this.handleScreenResize, false ); 
        this._isMounted = false;
    }
    componentDidMount () {
        this._isMounted = true;     
        window.addEventListener( 'resize', this.handleScreenResize, false );
    }
    componentDidUpdate () {
        if ( this.state.isActionLoginOut ) {
            this.setState( { isActionLoginOut: false }, () => {
                this.props.updateUser();
            } );
        }
    }

    render () {    
        const { screenSize, userInput, showSignupModal, loginError } = this.state;   
        
        return (
            <div className="header">               
                <Container className="headerContainer">
                    <Row>
                        <Col className="headerTitleCol">
                            <Link to={'/'}><h1>The Black Hole</h1></Link>
                        </Col>
                        <Col className="headerLoginCol">
                            {
                                localStorage.getItem( 'userLoggedIn' )
                                    ? <WelcomeUser size={screenSize} handleLogout={this.handleLogout}/>
                                    : <LoginForm size={screenSize} handleChange={this.handleChange} handleLogin={this.handleLogin} userInput={userInput}/>
                            }                           
                        </Col>
                        {
                            !localStorage.getItem( 'userLoggedIn' )
                                ? <Col className="headerSignupCol">
                                    <Button size={screenSize} variant="success" onClick={this.handleShowSignup}>Sign Up</Button>
                                    {
                                        showSignupModal && <SignupForm 
                                            showSignupModal={showSignupModal} 
                                            handleNewUserAdded={this.handleNewUserAdded}
                                            handleSignupClose={this.handleSignupClose}/>
                                    }          
                                </Col> 
                                : <Col/>
                        }
                    </Row> 
                    <LoginError loginError={loginError}/>
                    <Row className="headerInfo">
                        <Col/>
                        <Col className="headerInfoCol">
                            {!localStorage.getItem( 'userLoggedIn' ) && <Alert variant='primary'>
                                Signup or login (using any of the available users e.g shumi) to be able to create new topics, post articles, comment and vote.</Alert>}
                        </Col>
                        <Col/>
                    </Row>
                </Container>
            </div>
        );
    }
    
}

Header.propTypes = {
    updateUser: PropTypes.func,
};

export default Header;
