import React, {Component} from 'react';
import {Dropdown, DropdownButton} from 'react-bootstrap'
import { getAllTopics } from '../utils/APICalls';

class TopicsDropdown extends Component {
    
    render () {
        const {topics} = this.props;        
        return (      
            <DropdownButton id="dropdown-filter-button" title="Filter articles by topic" variant='primary'>
            {topics &&
                    topics.map((topic) => {
                        return (
                            <Dropdown.Item eventKey={topic.slug} key={topic.slug} 
                                    onSelect={this.props.handleFilterSelect}>{topic.slug}</Dropdown.Item>                    
                        )
                    })}
                        
        </DropdownButton>            
        )
    }
}

export default TopicsDropdown;
