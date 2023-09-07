import { motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import { domainApprovedToggleAPI, getDomainDataAPI } from "../../services";
import throwNotification from "../../general/throwNotifiaction";
import { Spin, Switch } from "antd";
import GovTrTableComponent from "./datapage-components/GovTrTableComponent";
import InfosTableComponent from "./datapage-components/InfosTableComponent";

const DataPage = () => {

    const params = useParams();

    const [ loading, setLoading ] = React.useState( false );
    const [ data, setData ]       = React.useState( { domain:'', dropDate:'', expiryDate:'', status:'', registerDate:'', id:-1, govTrResult:[], infos:[] } );
    const [ selectedInfos, setSelectedInfos ] = React.useState([]);
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

    React.useEffect( () => {
        console.log(selectedInfos)// direkt id'ler var
    }, [selectedInfos]);
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
                        <GovTrTableComponent data={ data } />
                    </div>
                    <div style={{ width:800, height:700, display:'flex', flexDirection:'column', paddingLeft:50 }}>
                        <h3 style={{ margin:'5px 0 10px 0' }}> Bulunan Bilgiler </h3>
                        <InfosTableComponent data={data} setData={setData} setSelectedInfos={setSelectedInfos} selectedInfos={selectedInfos} />
                    </div>
                </>
                :
                <Spin/>
            }
            </div>
        </motion.div>)
}
export default DataPage;