const BASE_URL = 'http://127.0.0.1:8000'


const getDomainWithInfoAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = await request.json();
        return response;    
    } 
    catch ( error ) {
        console.log( error )
        return [];        
    }
}

const deleteInfoAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint, { 
            method:'DELETE',
        } );
        const response  = await request.json();
        return response;    
    } 
    catch ( error ) {
        console.log( error )
        return error;        
    }
}

const addDomainAPI = async ( { endpoint, rawData } ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint, { 
            method:'POST',
            body:rawData
        });
        const response  = await request.json();
        return response; 
    } 
    catch ( error ) {
        return { status:'error', error:error };        
    }
}

export{
    getDomainWithInfoAPI,
    deleteInfoAPI,
    addDomainAPI
}