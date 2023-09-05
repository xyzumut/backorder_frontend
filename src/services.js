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

const deleteDomainAPI = async ( endpoint ) => {
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

const addToQueueDomainAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = await request.json();
        return response;    
    } 
    catch ( error ) {
        console.log( error )
        return error;        
    }
}

const domainApprovedToggleAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = await request.json();
        return response;    
    } 
    catch ( error ) {
        console.log( error )
        return error;        
    }
}

const domainMultipleActionAPI = async ( { endpoint, rawData } ) => {
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

const getMailTemplateAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = await request.json();
        return response; 
    } 
    catch ( error ) {
        return error;        
    }
}

const addMailTemplateAPI = async ( { endpoint, rawData } ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint, { 
            method:'PATCH',
            body:rawData
        });
        const response  = await request.json();
        return response; 
    } 
    catch ( error ) {
        return { status:'error', error:error };        
    }
}

const sendTestMailAPI = async ( { endpoint, rawData } ) => {
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

const getDomainDataAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = await request.json();
        return response; 
    } 
    catch ( error ) {
        return error;        
    }
}

const addGoogleFieldsAPI = async ( { endpoint, rawData } ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint, {
            method:'POST',
            body:rawData
        });
        const response  = await request.json();
        return response; 
    } 
    catch ( error ) {
        return error;        
    }
}

const getGoogleFieldsAPI = async ( endpoint ) => {
    try {
        const request   = await fetch( BASE_URL+endpoint );
        const response  = await request.json();
        return response; 
    } 
    catch ( error ) {
        return error;        
    }
}

export{
    getDomainWithInfoAPI,
    deleteInfoAPI,
    addDomainAPI,
    deleteDomainAPI,
    addToQueueDomainAPI,
    domainApprovedToggleAPI,
    domainMultipleActionAPI,
    getMailTemplateAPI,
    addMailTemplateAPI,
    sendTestMailAPI,
    getDomainDataAPI,
    addGoogleFieldsAPI,
    getGoogleFieldsAPI
}