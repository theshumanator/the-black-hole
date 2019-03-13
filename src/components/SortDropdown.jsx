import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const SortDropdown = ( { size, handleSortSelect, sortDropdowns, dropDownTitle } ) => {
    return (
        <DropdownButton size={size} id="dropdown-sort-button" title={dropDownTitle} variant='primary'>
            {
                sortDropdowns.map( dropdownItem => {
                    return <Dropdown.Item key={dropdownItem.eventKey} eventKey={dropdownItem.eventKey} onSelect={handleSortSelect}>{dropdownItem.eventVal}</Dropdown.Item>;    
                } )
            }
        </DropdownButton>
    );
};

SortDropdown.propTypes = {
    handleSortSelect: PropTypes.func,
    sortDropdowns: PropTypes.array,
    size: PropTypes.string,   
    dropDownTitle: PropTypes.string,
};

export default SortDropdown;
