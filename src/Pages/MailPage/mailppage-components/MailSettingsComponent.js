import { Input, Button, Modal } from "antd";
import React from "react";
import ButtonComponent from "../../../general/ButtonComponent";
import { addMailTemplateAPI, sendTestMailAPI } from "../../../services";
import throwNotification from "../../../general/throwNotifiaction";

const MailSettingsComponent = ({  template, setTemplate }) => {

    const [ testData, setTestData ]         = React.useState( { target:'', subject:'Test Konu Başlığı' } );
    const [ modalVisible, setModalVisible ] = React.useState( false );
    const [ loading, setSetLoading ]        = React.useState( '' );

    return(
        <div style={{ width:400, height:800, display:'flex', paddingTop:100, paddingLeft:50, flexDirection:'column' }}>

            <ButtonComponent type="primary" style={{ width:'min-content', backgroundColor:'green', marginBottom:50 }} onClick = { async () => { 

                const data = JSON.stringify( { 
                    mailButtonText  : template.mailButtonText,
                    mailContent     : template.mailContent,
                    mailFooter1     : template.mailFooter1,
                    mailFooter2     : template.mailFooter2,
                    mailHeader      : template.mailHeader,
                })

                console.log( ' data : ', data );
                
                const request = await addMailTemplateAPI( { endpoint:'/mail/template', rawData:data } );

                if ( request.status && request.status !== 'error' ) {
                    throwNotification( {
                        duration:3,
                        type: request.status === true ? 'success' : 'danger',
                        description: request.message,
                        message:request.status === true ? 'Başarılı' : 'Hata'
                    } );
                }
                else if( request.status && request.status === 'error' ){
                    throwNotification( {
                        duration:5,
                        type:'error',
                        description: request.error,
                        message:'Hata'
                    } );
                }
                else{
                    throwNotification( {
                        duration:5,
                        type:'error',
                        description: 'Bir Hata oluştu',
                        message:'Hata'
                    } );
                }

            }}> Şablonu Kaydet </ButtonComponent>

            <h3> Kısa Kodlar </h3>
            <div style={{ width:350, height:100, display:'flex', justifyContent:'space-around', flexDirection:'column', marginBottom:50 }}>
                <div>
                    Düşecek Olan Domain : <span style={{ color:'gray', cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %domain% </span>
                </div>
                <div>
                    Hedef Mail Adresi : <span style={{ color:'gray', cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %hedef% </span>
                </div>
                <div>
                    Bilginin Alındığı Kaynak : <span style={{ color:'gray', cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %kaynak% </span>
                </div>
                <div>
                    Domainin Düşüş tarihi : <span style={{ color:'gray', cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %tarih% </span>
                </div>
            </div>

            <Button type="primary" htmlType="submit" onClick = { () => { setModalVisible( true ) } } style={{width:'50%'}}>
                Test Maili gönder
            </Button>

            <Modal 
                title="Test Maili Gönder" 
                open={ modalVisible } 
                footer={ [ <Button key="back" onClick={() => { setModalVisible( false ) }} type="primary" danger> Kapat </Button> ] } 
                onCancel={ () => { setModalVisible( false ) } }
            >
                <Input value = { testData.subject } placeholder="Test Konu Başlığı" onChange = { (e) => { setTestData( { ...testData, subject:e.currentTarget.value } ) } } style = {{ marginTop:20 }}/>
                <Input value = { testData.target }  placeholder="Hedef"             onChange = { (e) => { setTestData( { ...testData, target:e.currentTarget.value } ) } }  style = {{ margin:'20px 0' }}/>
                <ButtonComponent onClick = { async () => {

                    if ( testData.subject.trim() === '' || testData.target.trim() === '' ) {
                        throwNotification( {
                            duration:5,
                            type:'warning',
                            description: 'Test maili için konu başlığı veya hedef email adresi eksik',
                            message:'Eksik'
                        } );
                        return;
                    }

                    const data = JSON.stringify( { target:testData.target, subject:testData.subject } );

                    const request = await sendTestMailAPI( { endpoint:'/mail/test', rawData:data } );

                    if ( request.status && request.status !== 'error' ) {
                        throwNotification( {
                            duration:3,
                            type: request.status === true ? 'success' : 'danger',
                            description: request.message,
                            message:request.status === true ? 'Başarılı' : 'Hata'
                        } );
                    }
                    else{
                        throwNotification( {
                            duration:5,
                            type:'error',
                            description: 'Bir Hata oluştu',
                            message:'Hata'
                        } );
                    }
                } }> Yolla </ButtonComponent>
            </Modal>
        </div>
    )
}
export default MailSettingsComponent;