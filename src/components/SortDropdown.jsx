import React from 'react';
import {Dropdown, DropdownButton} from 'react-bootstrap'


const SortDropdown = ({screenSize, handleSortSelect, sortDropdowns}) => {
    return (
        <DropdownButton size={screenSize} className="sortDropdown" id="dropdown-basic-button" title="Sort By" variant='primary'>
        {
            sortDropdowns.map(dropdownItem => {
                return <Dropdown.Item key={dropdownItem.eventKey} eventKey={dropdownItem.eventKey} onSelect={handleSortSelect}>{dropdownItem.eventVal}</Dropdown.Item>    
            })
        }
        </DropdownButton>
    )
}

export default SortDropdown;


  