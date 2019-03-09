import React from 'react';
import Moment from 'react-moment';

const PrettyDate = ( { dateType, created_at } ) => {
    return (
        dateType === 'longDate'
            ? <Moment format="dddd, DD MMM YYYY HH:mm">{created_at}</Moment>
            : <Moment fromNow>{created_at}</Moment>        
    );
};

export default PrettyDate;