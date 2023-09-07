import { motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import { deleteInfoAPI, domainApprovedToggleAPI, getDomainDataAPI } from "../../services";
import throwNotification from "../../general/throwNotifiaction";
import { Spin, Table, Switch } from "antd";
import ButtonComponent from "../../general/ButtonComponent";

const DataPage = () => {

    const params = useParams();

    const [ loading, setLoading ] = React.useState( false );
    const [ data, setData ]       = React.useState( { domain:'', dropDate:'', expiryDate:'', status:'', registerDate:'', id:-1, govTrResult:[], infos:[] } );

    const getData = React.useCallback( async () => {
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
    }, [params.domain]);



    const handleApproved = async () => {
        const request = await domainApprovedToggleAPI( '/domain/toggle-approved/' + data.id );
        if ( request.status && request.status === true ) {
            setData( { ...data, status:request.data } ); 
            throwNotification( {
                duration:2,
                type:'success',
                description: request.message,
                message:'Başarılı'
            } );           
        }
        else{
            throwNotification( {
                duration:2,
                type:'error',
                description: request.message,
                message:'Hata'
            } );
        }
    }

    React.useEffect( () => {
        getData();
    }, [getData]);

    React.useEffect( () => {
        console.log( data.approved )
    }, [data])

    const setStatusLabel = ( text ) => {
        switch (text){
            case 'pending_queue':
                return 'Bekliyor';
            case 'in_queue':
                return 'Kuyrukta';
            case 'no-info':
                return 'Bilgi Bulunamadı';
            case 'pending_mail':
                return 'Mail Bekliyor';
            case 'completed':
                return 'Tamamlandı';
            case 'pending_approve':
                return 'Onay Bekliyor';
            default:
                return text;
        }
    }

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
                        <h4 style={{ margin:'5px 0' }}> Bitiş Tarihi : { data.expiryDate } </h4>
                        <h4 style={{ margin:'5px 0' }}> Kayıt Tarihi : { data.registerDate } </h4>
                        <h4 style={{ margin:'5px 0' }}> Durumu : {setStatusLabel(data.status)} </h4>
                        <h4 style={{ margin:'5px 0' }}> Onay : <Switch disabled = { data.status   === 'pending_queue' || data.status   === 'in_queue' || data.status === 'no-info'  }  checked  = { data.status === 'pending_mail'  || data.status === 'completed' } onChange = { async () => { await handleApproved(); } } /> </h4>
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
                                            const request = await deleteInfoAPI( '/information/delete/'+props.key );
                                            if ( request.status && request.status === true ) {
                                                throwNotification( {
                                                    duration:2,
                                                    type:'success',
                                                    description: request.message,
                                                    message:'Başarılı'
                                                } );
                                                setData( { ...data, infos:data.infos.filter( info => info.key !== props.key ) } );
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
                            pagination = {{ defaultPageSize:50 }}
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