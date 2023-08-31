import { Modal, DatePicker, Button, Input } from "antd"
import React from "react"
import throwNotification from "../../../general/throwNotifiaction";
import { addDomainAPI } from "../../../services";


const ModalComponent = ( { isModalOpen, setIsModalOpen } ) => {

    const [ domain, setDomain ] = React.useState(''); 
    const [ date, setDate ] = React.useState( null );
    const [ loading, setLoading ] = React.useState( false )

    return(
        <Modal 
            title="Yeni Domain ekle" 
            open={isModalOpen} 
            footer={ [ <Button key="back" onClick={() => { setIsModalOpen(false) }} type="primary" danger> Kapat </Button> ] } 
            onCancel={ () => { setIsModalOpen( false ) } }
        >
            <Input value={domain} placeholder='Domaini Girin' onChange={(val) => { setDomain( val.currentTarget.value ) }}/>
            <DatePicker value={date} placeholder='Düşüş Tarihini Seçin' style={{ width:200, margin:'20px 0', display:'block' }} onChange={(val) => { setDate( val ) }}/>
            <Button loading={ loading } type='primary' onClick={ async () => {
                
                if ( date === null || domain === '' ) {
                    throwNotification( {
                        message:'Uyarı',
                        description:'Düşme tarihi veya domain bilgisi girilmedi',
                        type:'warning'
                    } )
                }
                else{
                    setLoading( true );
                    const response = await addDomainAPI( { endpoint:'/domain/add', rawData:JSON.stringify( { dropDate:date.format('YYYY-MM-DD'), domain:domain } ) } );
                    if ( response.status && response.status === true ) {
                        throwNotification( {
                            message:'Başarılı',
                            description:'Yeni domain düşüş tarihi ile birlikte sıraya eklendi',
                            type:'success'
                        } )
                        setDate( null );
                        setDomain( '' );
                    }
                    else if( response.status && response.status === 'error' ){
                        console.log( response.error );
                        throwNotification( {
                            message:'Hata',
                            description:'Yeni domain eklenirken hata oluştu',
                            type:'error'
                        } )
                    }
                    setLoading( false );
                }
                
                
            }}> Gönder </Button>
        </Modal>  
    )
}
export default ModalComponent;