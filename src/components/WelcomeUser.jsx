import React from 'react';
import '../main.css';
import { Container, Button} from 'react-bootstrap';
import {Link} from '@reach/router';

const WelcomeUser = (props) => {
    const username = localStorage.getItem('userLoggedIn');
    return (
        <Container>
            <h5>Welcome back, <Link key={username} to={`/users/${username}`}>{username}</Link></h5>
            <Button variant="primary" onClick={props.handleLogout}>Logout</Button>
        </Container>
        
    )
}

export default WelcomeUser;