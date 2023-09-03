import { motion } from "framer-motion";
import React from "react";
import TableComponent from "./homepage-components/TableComponent";
import SearchComponent from "./homepage-components/SearchComponent";
import SelectFilterComponent from "./homepage-components/SelectFilterComponent";
import SelectActionComponent from "./homepage-components/SelectActionComponent";
import { domainMultipleActionAPI, getDomainWithInfoAPI } from "../../services";
import { useHomePage } from "../../context/homepage-context";
import { Spin, FloatButton, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ModalComponent from "./homepage-components/ModalComponent";
import throwNotification from "../../general/throwNotifiaction";
const { RangePicker } = DatePicker;

const Homepage = () => {
    
    const [ selected, setSelected ]                     = React.useState( [] ); // seçilen satırları tuttuğum state
    const [ loading, setLoading ]                       = React.useState( true ); // verilerin gelip gelmediğinin loaderi
    const [ selectActionState, setSelectActionState ]   = React.useState( '' );
    const [ isModalOpen, setIsModalOpen ]               = React.useState(false);

    const { query, setQuery, data, setData, setMeta, meta } = useHomePage()

    const loadData = React.useCallback( async () => {
        setLoading( true );
        const requestQuery = `?orderBy=${query.orderBy}&sortBy=${query.sortBy}&pagePerSize=${query.pagePerSize}&page=${query.page}&filter=${query.filter}&search=${query.search}&startDate=${query.startDate || ''}&&endDate=${query.endDate || ''}`; 
        const response = await getDomainWithInfoAPI( '/domain/getDomainWithInformation'+requestQuery );
        setData( response.data );
        setMeta( response.meta )
        setLoading( false );
    }, [ query ])

    const handleRangePicker = ( val ) => {
        if ( val === null ) {
            setQuery( { ...query, startData:'', endDate:'', page:1 } );
            return;
        }
        const startDate = val[ 0 ].format( 'YYYY-MM-DD' );
        const endDate   = val[ 1 ].format( 'YYYY-MM-DD' );
        setQuery( { ...query, startDate:startDate, endDate:endDate } );
    }

    const selectActionFunction = async () => {

        if ( selected.length < 1 ) {
            throwNotification( {
                duration:3,
                type:'warning',
                description: 'En az bir satır seçilmeli',
                message:'Eksik'
            } );
            return;
        }

        if ( selectActionState === '' ) {
            throwNotification( {
                duration:3,
                type:'warning',
                description: 'Bir operasyon seçilmeli',
                message:'Eksik'
            } );
            return;
        }

        const domainIDS = selected.map( item => item.key );

        const request = await domainMultipleActionAPI( {
            endpoint:'/domain/multiple',
            rawData:JSON.stringify( { domainIDS: domainIDS, operation: selectActionState } )
        } )

        if( request.status ) {
            setQuery( { ...query } );
            throwNotification( {
                duration:3,
                type:'success',
                description: request.message,
                message:'Başarılı'
            } );
            setSelected( [] );
            setSelectActionState( '' );
        }
        else{
            throwNotification( {
                type:'error',
                description:request.message,
                message:'Başarısız'
            } );
        }
    }

    React.useEffect( () => {
        loadData();
    }, [ loadData ])


    return (
        <motion.div initial = {{ opacity:0 }} animate = {{ opacity:1 }} style = {{ display:'flex', width:'100%', height:'100vh', justifyContent:'center', alignItems:'flex-start' }}> 
            <div>
                <div style = {{ width:1200, display:'flex', flexDirection:'column', marginTop:20 }} >
                    <div style = {{ width:1200, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                        <SelectActionComponent 
                            loading = { loading } 
                            selectActionState = { selectActionState } 
                            setSelectActionState = { setSelectActionState } 
                            action={ selectActionFunction } 
                        />
                        <RangePicker
                            format="YYYY-MM-DD"
                            onChange={ ( val ) => { handleRangePicker( val ) } }
                        />
                        <SelectFilterComponent selectedAction = { selectActionState } />
                    </div>
                    <div style={{ width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}> 
                        <SearchComponent loading = { false }  width = { '90%' } /> 
                        { !loading && <div style={{ backgroundColor:'#1677ff', padding:5, borderRadius:5, color:'white' }}> { meta && meta.pagePerSize ? meta.pagePerSize : 0 }/{ meta && meta.filteredDataCount ? meta.filteredDataCount : 0} </div> }  
                    </div>
                    { !loading ? <TableComponent  loading = { loading } setLoading={ setLoading } selected = { selected } setSelected = { setSelected }/> : <Spin/> }
                    <FloatButton icon={ <PlusOutlined/>} onClick={ () => { setIsModalOpen( true ) } } />  
                    <ModalComponent isModalOpen={isModalOpen} setIsModalOpen={ setIsModalOpen }/>
                </div>
            </div>
        </motion.div>
    );
}
export default Homepage;