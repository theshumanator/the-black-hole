import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'react-bootstrap';

const BreadCrumb = ( { currentPage } ) => {
    return (
        <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>            
            <Breadcrumb.Item active>{currentPage}</Breadcrumb.Item>
        </Breadcrumb>
    );
};

BreadCrumb.propTypes = {
    currentPage: PropTypes.string,    
};

export default BreadCrumb;
