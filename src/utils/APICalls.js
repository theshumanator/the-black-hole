const axios = require( 'axios' );
const { BASE_URL } = require( '../utils/urls' );

const translateMethod = ( method ) => {
    const methodTranslation = {
        'get': 'fetch',
        'post': 'create',
        'patch': 'update',
        'put': 'update',
        'delete': 'delete'
    };
    return methodTranslation[ method ];
};
const makeAPICalls = ( { url, reqObjectKey, params, data, method, multiRes } ) => {    
    const instance = axios.create( {
        baseURL: `${ BASE_URL }`,
        url,
        params,
        method,
        data
    } );
    
    const action = translateMethod( method );    
    const genericMsg = `Could not ${ action } ${ reqObjectKey }. Contact Support.`;

    if ( method === 'delete' ) {
        return new Promise ( ( resolve, reject ) => {
            instance.request( )
                .then( ( { status } ) => {                    
                    resolve( status );
                } )
                .catch( ( { response: { data } } ) => {                  
                    const err = data.msg ? data.msg : genericMsg; 
                    reject( err ) ;
                } );
        } );
    } else if ( multiRes ) {
        return new Promise ( ( resolve, reject ) => {
            instance.request( )
                .then( ( { data } ) => {                    
                    resolve( data );
                } )
                .catch( ( res ) => {     
                    const err = res.data ? res.data.msg : genericMsg;                     
                    reject( err ) ;
                } );
        } );
    } else {
        return new Promise ( ( resolve, reject ) => {
            instance.request( )
                .then( ( { data: { [ reqObjectKey ]: value } } ) => {                    
                    resolve( value );
                } )
                .catch( ( { response: { data } } ) => {                  
                    const err = data.msg ? data.msg : genericMsg; 
                    reject( err ) ;
                } );
        } );
    }
    
};

module.exports = { makeAPICalls };
