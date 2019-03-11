import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from '@reach/router';
import { makeAPICalls } from '../utils/APICalls';
import BreadCrumb from './BreadCrumb';
import axios from 'axios';

class UsersList extends Component {

    //avoid memory leak cancel all axios requests, etc
	CancelToken = axios.CancelToken;
	source = this.CancelToken.source();
    _isMounted = false;
    
    state = {
        users: [],
        hasError: false
    }
    componentDidMount() {
        this._isMounted = true;
        this.fetchAllUsers();        
    }
    componentDidUpdate( prevProps ) {
        if ( this.props.newUserAdded !== prevProps.newUserAdded ) {
            this.fetchAllUsers();
        }
    }

    componentWillUnmount() {
        this.source.cancel( 'Cancel axios requests as user moved off page' );
        this._isMounted = false;
    }
    
    fetchAllUsers = () => {
        const obj = {
            url: '/users',
            reqObjectKey: 'users',
            method: 'get',
            cancelToken: this.source.token,
        };
        this._isMounted && makeAPICalls( obj )
            .then( ( users ) => {
                this.setState( { users, error: null, hasError: false } );
            } )
            .catch( ( error ) => {
                if ( !axios.isCancel( error ) ) {
                    this.setState( { users: [], hasError: true } );
                }                
            } );
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