const BASE_URL = 'http://127.0.0.1:8000'


const getDomainWithInfoAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = request.json();
        return response;    
    } 
    catch ( error ) {
        console.log( error )
        return [];        
    }
}

const deleteInfoAPI = async ( endpoint ) => {
    console.log( 'umut' )
    try {
        const request   = await fetch( BASE_URL+endpoint, { 
            method:'DELETE',
        } );
        const response  = request.json();
        return response;    
    } 
    catch ( error ) {
        return error;        
    }
}


export{
    getDomainWithInfoAPI,
    deleteInfoAPI
}