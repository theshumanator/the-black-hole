import React from 'react';
import Moment from 'react-moment';

const PrettyDate = ( props ) => {
    //console.log(props);
    return (
        props.dateType === 'longDate'
        ? <Moment format="dddd, DD MMM YYYY HH:mm">{props.created_at}</Moment>
        : <Moment fromNow>{props.created_at}</Moment>        
    );
};


export default PrettyDate;