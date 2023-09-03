import { motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import { getDomainDataAPI } from "../../services";
import throwNotification from "../../general/throwNotifiaction";
import { Spin } from "antd";

const DataPage = () => {

    const params = useParams();

    const [ loading, setLoading ] = React.useState( false );
    const [ data, setData ]       = React.useState( [] );

    const getData = async () => {
        setLoading( true );
        const request = await getDomainDataAPI( '/domain/get/'+params.domain );
        if ( request.status === true ) {
            setData( request.data );
            throwNotification( {
                duration:3,
                type:'success',
                description: 'Bilgiler Getirildi',
                message:'Başarılı'
            } );
        }
        else{
            throwNotification( {
                duration:3,
                type:'error',
                description: params.domain+'\'e ait bilgiler getirilirken bir hata oluştu',
                message:'Hata'
            } );
            request.message && console.error( request.message );
        }
        setLoading( false );
    }

    React.useEffect( () => {
        getData();
    }, []);

    return (
        <motion.div
            initial = {{ opacity:0, translateY:100  }}
            animate = {{ opacity:1, translateY:0    }}
        > 
            <div style={{ backgroundColor:'red', width:1500, height:800, display:'flex', justifyContent:'center', alignItems:'center', margin:'50px auto' }}>
            {
                !loading
                ?
                <h1>Veriler geldi</h1>
                :
                <Spin/>
            }
            </div>
        </motion.div>)
}
export default DataPage;