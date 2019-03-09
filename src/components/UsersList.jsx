import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from '@reach/router';
import { makeAPICalls } from '../utils/APICalls';
import BreadCrumb from './BreadCrumb';

class UsersList extends Component {
    state = {
        users: [],
        hasError: false
    }
    componentDidMount() {
        this.fetchAllUsers();        
    }
    componentDidUpdate( prevProps ) {
        if ( this.props.newUserAdded !== prevProps.newUserAdded ) {
            this.fetchAllUsers();
        }
    }

    fetchAllUsers = () => {
        const obj = {
            url: '/users',
            reqObjectKey: 'users',
            method: 'get'
        };
        makeAPICalls( obj )
            .then( ( users ) => {
                this.setState( { users, error: null, hasError: false } );
            } )
            .catch( ( ) => this.setState( { users: [], hasError: true } ) );
    }
    render() {
        const { users, hasError } = this.state;        
        return (
            <div className="userListDiv">
                <BreadCrumb currentPage={'Black hole users'}/>
                {
                    hasError
                        ? <h3 className="userListHeader">There are currently no users in the black hole</h3>
                        : users &&        
                            <>     
                                <div className="userListHeader">
                                    <h3>Users in the black hole</h3>
                                    <h5>You can use any of these usernames to login</h5>
                                </div>                                            
                                
                                <ListGroup className="userListGroup">                                
                                    {users.map( ( user ) => {                            
                                        return (
                                            <ListGroup.Item key={user.username} className="userListItem">
                                                <Link to={`/users/${ user.username }`}>{user.username}</Link>
                                            </ListGroup.Item>
                                        );} )}
                                </ListGroup>
                            </>
                }
            </div>
        );
    }    
}

export default UsersList;