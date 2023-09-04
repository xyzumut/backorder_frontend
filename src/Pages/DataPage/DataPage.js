import { motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import { deleteInfoAPI, getDomainDataAPI } from "../../services";
import throwNotification from "../../general/throwNotifiaction";
import { Spin, Table } from "antd";
import ButtonComponent from "../../general/ButtonComponent";

const DataPage = () => {

    const params = useParams();

    const [ loading, setLoading ] = React.useState( false );
    const [ data, setData ]       = React.useState( { domain:'', dropDate:'', govTrResult:[], infos:[] } );

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
            const mails = request.data.infos.filter( item => item.type === 'mail' );
            const others = request.data.infos.filter( item => item.type !== 'mail' );
            setData( { ...request.data, infos:[ ...mails, ...others ] } );
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
            <div style={{ width:1500, height:900, display:'flex', justifyContent:'center', alignItems:'center', margin:'10px auto', flexWrap:'wrap', flexDirection:'row' }}>
            {
                !loading
                ?
                <>
                    <div style={{ width:700, height:700, display:'flex', flexDirection:'column' }}>
                        <h3 style={{ margin:'5px 0' }}> Domain : { data.domain } </h3>
                        <h4 style={{ margin:'5px 0' }}> Düşüş Tarihi : { data.dropDate } </h4>
                        <h4 style={{ margin:'5px 0' }}> Durumu : Kuyrukta </h4>
                        <h4 style={{ margin:'5px 0' }}> Onay : </h4>
                        <h3 style={{ margin:'5px 0' }}> E-Ticaret Bilgi Formu Sonuçları </h3>
                        <Table 
                            scroll  = { { y:550 } }
                            style   = { { width:700 } }
                            columns = { [ 
                                {
                                    title: 'Adres',
                                    dataIndex: 'siteAdress',
                                    align:'center',
                                },
                                {
                                    title:'Ünvan',
                                    dataIndex: 'companyTitle',
                                    align:'center'
                                },
                                {
                                    title:'VkNo',
                                    dataIndex: 'vkNo',
                                    align:'center'
                                },
                                {
                                    title:'Mersis',
                                    dataIndex: 'mersisNo',
                                    align:'center'
                                }
                            ]}
                            dataSource={ data.govTrResult || [] }
                        />
                    </div>
                    <div style={{ width:800, height:700, display:'flex', flexDirection:'column', paddingLeft:50 }}>
                        <h3 style={{ margin:'5px 0 10px 0' }}> Bulunan Bilgiler </h3>
                        <Table 
                            scroll  = { { y:550 } }
                            style   = { { width:750 } }
                            columns = { [ 
                                {
                                    title: 'Bilgi',
                                    dataIndex: 'information',
                                    align:'center',
                                },
                                {
                                    title:'Kaynak',
                                    key: 'informationSource',
                                    align:'center',
                                    render:( props ) => <a target="_blank" rel="noreferrer" href={'//'+props.informationSource}>{props.informationSource}</a>
                                },
                                {
                                    title:'#',
                                    key: 'key',
                                    align:'center',
                                    render : ( props ) => {
                                        return <ButtonComponent onClick = { async () => {
                                            const request = await deleteInfoAPI( { endpoint:'/information/delete', rawData:JSON.stringify( { info:props.information } ) } );
                                            if ( request.status && request.status === true ) {
                                                throwNotification( {
                                                    duration:2,
                                                    type:'success',
                                                    description: request.message,
                                                    message:'Başarılı'
                                                } );
                                                setData( { ...data, infos:data.infos.filter( info => info.information !== props.information ) } );
                                            }
                                            else{
                                                throwNotification( {
                                                    duration:4,
                                                    type:'error',
                                                    description: request.message || 'Silme İşlemi sırasında bir hata oluştu',
                                                    message:'Hata'
                                                } );
                                            }

                                        } }> Sil </ButtonComponent>
                                    }
                                }
                            ]}
                            dataSource={ data.infos || [] }
                            pagination = {{ pageSize:50 }}
                        />
                    </div>
                </>
                :
                <Spin/>
            }
            </div>
        </motion.div>)
}
export default DataPage;