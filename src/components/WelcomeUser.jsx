import React from 'react';
import '../main.css';
import { Container, Button } from 'react-bootstrap';
import { Link } from '@reach/router';

const WelcomeUser = ( { size, handleLogout } ) => {    
    const username = localStorage.getItem( 'userLoggedIn' );
    return (
        <Container>
            <h5 className="welcomeTxt">Welcome back, <Link key={username} to={`/users/${ username }`} className="welcomeName">{username}</Link></h5>
            <Button size={size} variant="primary" onClick={handleLogout}>Logout</Button>
        </Container>
        
    );
};

export default WelcomeUser;