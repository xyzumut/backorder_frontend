import React, {useContext, createContext } from "react";

const HomepageContext = createContext()
const useHomePage = () => {return useContext(HomepageContext)}
const HomepageContextProvider = ({children}) => {

    const initialQuery = {
        sortBy:'id',
        orderBy:'ASC',
        pagePerSize:10,
        page:1,
        filter:0,
        search:'',
        startDate:'',
        endDate:''
    }

    const [ query, setQuery ] = React.useState( initialQuery )
    const [ data, setData ]   = React.useState( [] ); // genel datayı tuttuğum state
    const [ meta, setMeta ]   = React.useState( {} );

    const myStates = { query, setQuery, initialQuery, data, setData, meta, setMeta }

    return(
        <HomepageContext.Provider value={ myStates }>
            {children}
        </HomepageContext.Provider>
    )
}
export{
    useHomePage,
    HomepageContextProvider
}