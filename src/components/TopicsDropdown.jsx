import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class TopicsDropdown extends Component {
    
    render () {
        const { topics, size } = this.props;        
        return (      
            <DropdownButton size={size} id="dropdown-filter-button" title="Filter by topic" variant='primary'>
                {topics &&
                    topics.map( ( topic ) => {
                        return (
                            <Dropdown.Item eventKey={topic.slug} key={topic.slug} 
                                onSelect={this.props.handleFilterSelect}>{topic.slug}</Dropdown.Item>                    
                        );
                    } )}
                        
            </DropdownButton>            
        );
    }
}

TopicsDropdown.propTypes = {
    handleFilterSelect: PropTypes.func,
    topics: PropTypes.array,
    size: PropTypes.string,    
};

export default TopicsDropdown;
