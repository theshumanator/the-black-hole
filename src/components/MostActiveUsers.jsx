import React, {Component} from 'react'
import {ListGroup} from 'react-bootstrap';
import {getMostActive} from '../utils/dataAnalysis';

const MostActiveUsers = () => {
    const mostActive = getMostActive();

        return (
            <ListGroup>
                {
                    mostActive.map(user => {
                        return (
                            <ListGroup.Item>{user}</ListGroup.Item>
                        )
                    })
                }                
            </ListGroup>
        )    
}

export default MostActiveUsers;