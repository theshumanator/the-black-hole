import React from 'react';
import '../main.css';
import { Container, Button} from 'react-bootstrap';

const WelcomeUser = (props) => {

    return (
        <Container>
            <h5>Welcome back, {localStorage.getItem('userLoggedIn')}</h5>
            <Button variant="primary" onClick={props.handleLogout}>Logout</Button>
        </Container>
        
    )
}

export default WelcomeUser;