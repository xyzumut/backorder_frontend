import { motion } from "framer-motion";
import React from "react";
import TableComponent from "./homepage-components/TableComponent";
import SearchComponent from "./homepage-components/SearchComponent";
import SelectFilterComponent from "./homepage-components/SelectFilterComponent";
import SelectActionComponent from "./homepage-components/SelectActionComponent";
import { getDomainWithInfoAPI } from "../../services";

const Homepage = () => {

    const initialQuery = {
        sortBy:'id',
        orderBy:'ASC',
        pagePerSize:10,
        page:1,
        filter:0,
        search:''
    }

    const [ query, setQuery ] = React.useState( initialQuery )
    const [ data, setData ]                 = React.useState( [] ); // genel datayı tuttuğum state
    const [ selected, setSelected ]         = React.useState( {} ); // seçilen satırları tuttuğum state
    const [ loading, setLoading ]           = React.useState( true ); // verilerin gelip gelmediğinin loaderi
    const [ selectActionState, setSelectActionState ] = React.useState( '' );

    const loadData = React.useCallback( async () => {
        setLoading( true );
        const requestQuery = `?orderBy=${query.orderBy}&sortBy=${query.sortBy}&pagePerSize=${query.pagePerSize}&page=${query.page}&filter=${query.filter}&search=${query.search}`; 
        let data = await getDomainWithInfoAPI( '/domain/getDomainWithInformation'+requestQuery );
        setData( data );
        setLoading( false );
    }, [ query ])

    React.useEffect( () => {
        loadData();
    }, [ loadData ])

    return (
        <motion.div initial = {{ opacity:0 }} animate = {{ opacity:1 }} style = {{ display:'flex', width:'100%', height:'100vh', justifyContent:'center', alignItems:'flex-start' }}> 
            <div>
                <div style = {{ width:1200, display:'flex', flexDirection:'column' }} >
                    <div style = {{ width:1200, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                        <SelectFilterComponent query = { query } setQuery = { setQuery } />
                        <SelectActionComponent 
                            loading = { loading } query = { query } setQuery = { setQuery }  
                            selectActionState = { selectActionState } 
                            setSelectActionState = { setSelectActionState } 
                            action={ () => {
                                console.log( 'Seçilen işlem : ', selectActionState );  
                                console.log( 'Seçili satırlar : ', selected );
                            } } 
                        />
                    </div>
                    <SearchComponent loading = { false }   query = { query } setQuery = { setQuery } initialQuery = { initialQuery } width = { '100%' } style = {{ marginBottom:20 }} />
                    <TableComponent  loading = { loading } query = { query } setQuery = { setQuery } initialQuery = { initialQuery } selected = { selected }      setSelected = { setSelected }       data = { data } />
                </div>
            </div>
        </motion.div>
    );
}
export default Homepage;