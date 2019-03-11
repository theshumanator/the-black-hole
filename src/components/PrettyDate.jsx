import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const PrettyDate = ( { dateType, created_at } ) => {
    return (
        dateType === 'longDate'
            ? <Moment format="dddd, DD MMM YYYY HH:mm">{created_at}</Moment>
            : <Moment fromNow>{created_at}</Moment>        
    );
};

PrettyDate.propTypes = {
    dateType: PropTypes.string,
    created_at: PropTypes.string
};

export default PrettyDate;