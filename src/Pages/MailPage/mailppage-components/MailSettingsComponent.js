import { Input, Button, Modal, Form, Spin } from "antd";
import React from "react";
import ButtonComponent from "../../../general/ButtonComponent";
import { addMailTemplateAPI, getMailTargetDateAPI, getSMTPConfigAPI, sendTestMailAPI, setMailTargetDateAPI, setSMTPConfigAPI } from "../../../services";
import throwNotification from "../../../general/throwNotifiaction";
import { InputNumber } from 'antd';
import debounce from "lodash.debounce";
const MailSettingsComponent = ({  template, setTemplate }) => {

    const [ testData, setTestData ]                 = React.useState( { target:'', subject:'Test Konu Başlığı' } );
    const [ modalVisible, setModalVisible ]         = React.useState( false );
    const [ smtpModalVisible, setSmtpModalVisible ] = React.useState( false );
    const [ mailSettings, setMailSettings ] = React.useState( { smtpServer:'', port:'', username:'', password:'', } )
    const [ mailDateNumber, setMailDataNumber ] = React.useState( -1 );
    const [ mailSettingsFields, setMailSettingsFields ] = React.useState([
        {
          name: ['smtpServer'],
          value: '',
        },
        {
            name: ['port'],
            value: '',
        },
        {
            name: ['username'],
            value: '',
        },
        {
            name: ['password'],
            value: '',
        },
    ]);

    const debouncedHandle = React.useMemo(() => {
        return debounce( async (value) => {
            const temp = mailDateNumber;
            setMailDataNumber(-1);
            const request = await setMailTargetDateAPI( { endpoint:'/options/setMailTargetDate', rawData:JSON.stringify({ targetDate:value }) } );
            if ( request.status && request.status === true ) {
                setMailDataNumber( value );
            }
            else{
                setMailDataNumber( temp );
                throwNotification( {
                    duration:5,
                    type:'error',
                    description: request.error,
                    message:'Hata'
                } );
            }
        }, 750);
    }, [mailDateNumber]);

    const getMailDateNumber = async () => {
        const request = await getMailTargetDateAPI( '/options/getMailTargetDate' );
        if( request.status && request.status === true ){
            setMailDataNumber( request.data );
        }
        else{
            setMailDataNumber( 15 );
        }
    }

    const handleSetMailDateNumber = async ( val ) => {
        debouncedHandle(val)
    }

    React.useEffect( () => {
        getMailDateNumber();
    }) 

    React.useEffect(() => {
        return () => {
            debouncedHandle.cancel();
        };
    }, [debouncedHandle]);
    
    return(
        <div style={{ width:400, height:800, display:'flex', paddingTop:100, paddingLeft:50, flexDirection:'column' }}>

            <div style={{ width:400, height:100 }}>
                Kaç gün öncesine mail atsın? : { mailDateNumber !== -1 ? <InputNumber /*min={1} max={30}*/ defaultValue={mailDateNumber} onChange={ ( e ) => { handleSetMailDateNumber(e) } }/> : <Spin/> }
            </div>

            <Input placeholder="Mail Konusu" value={template.subject} onChange={ (e) => { setTemplate( { ...template, subject:e.currentTarget.value } ) } } maxLength={50} />

            <ButtonComponent type="primary" style={{ width:'min-content', backgroundColor:'green', marginBottom:30, marginTop:30 }} onClick = { async () => { 

                const data = JSON.stringify( { 
                    subject         : template.subject,
                    mailButtonText  : template.mailButtonText,
                    mailContent     : template.mailContent,
                    mailFooter1     : template.mailFooter1,
                    mailFooter2     : template.mailFooter2,
                    mailHeader      : template.mailHeader,
                })

                const request = await addMailTemplateAPI( { endpoint:'/options/template', rawData:data } );

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
                <div style={{ color:'gray' }}>
                    Düşecek Olan Domain : <span style={{ color:'black', fontWeight:800, cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %domain% </span>
                </div>
                <div style={{ color:'gray' }}>
                    Hedef Mail Adresi : <span style={{ color:'black', fontWeight:800, cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %hedef% </span>
                </div>
                <div style={{ color:'gray' }}>
                    Bilginin Alındığı Kaynak : <span style={{ color:'black', fontWeight:800, cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %kaynak% </span>
                </div>
                <div style={{ color:'gray' }}>
                    Domainin Düşüş tarihi : <span style={{ color:'black', fontWeight:800, cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %tarih% </span>
                </div>
            </div>

            <Button type="primary" htmlType="submit" onClick = { () => { setModalVisible( true ) } } style={{width:'50%'}}>
                Test Maili gönder
            </Button>

            <ButtonComponent disabled={true} type="primary" style={{width:'55%', marginTop:20}} onClick = { async () => { 
                
                const request = await getSMTPConfigAPI( '/options/getconfig' );

                if ( request.status === true ) {
                    const data = request.data;
                    setMailSettingsFields( [ 
                        { name:'username',   value:data.username    }, 
                        { name:'password',   value:data.password    }, 
                        { name:'port',       value:data.port        }, 
                        { name:'smtpServer', value:data.smtpServer  }
                    ] );
                    setSmtpModalVisible( true );
                    return;
                }
                throwNotification( { 
                    description:'Mail SMTP Ayarları getirilirken ciddi sorun oluştu',
                    duration:6,
                    message:'Hata',
                    type:'error'
                } )
            } } >
                SMTP Bilgilerini Göster
            </ButtonComponent>

            <Modal 
                title="SMTP Bilgileri"
                footer={ [ <Button key="back" onClick={() => { setSmtpModalVisible( false ) }} type="primary" danger> Kapat </Button> ] } 
                open={ smtpModalVisible }
                onCancel={ () => { setSmtpModalVisible( false ) } }
            >
                <Form 
                    labelCol = {{ span:8 }}
                    fields = {mailSettingsFields}
                    style = {{ marginTop:10 }}
                    onFinish = { async () => { 

                        const rawData = JSON.stringify( 
                            { 
                                smtpServer  :mailSettings.smtpServer, 
                                username    :mailSettings.username, 
                                password    :mailSettings.password, 
                                port        :mailSettings.port 
                            } 
                        );
                        
                        const request = await setSMTPConfigAPI( { endpoint:'/options/setconfig', rawData:rawData } );

                        if ( request.status === true ) {
                            throwNotification( {
                                duration:2,
                                type:'success',
                                description: request.message,
                                message:'Başarılı'
                            } );
                        }
                        else{
                            throwNotification( {
                                duration:5,
                                type:'error',
                                description: request.message ? request.message : 'SMTP Ayarlarında değişiklik yapılamadı',
                                message:'Başarısız'
                            } );
                        }
                    }}
                >
                    <Form.Item
                        label="Smtp Sunucusu"
                        name="smtpServer"
                        rules={[
                            {
                                required: true,
                                message: 'SMTP Sunucusunu Girin',
                            },
                        ]}
                    >
                        <Input value={ mailSettings.smtpServer } onChange={ (e) => { setMailSettings( { ...mailSettings, smtpServer:e.currentTarget.value } )  } }/>
                    </Form.Item>
                    <Form.Item
                        label="SMTP Portunu"
                        name="port"
                        rules={[
                            {
                                required: true,
                                message: 'SMTP Portunu Girin',
                            },
                        ]}
                    >
                        <Input value={ mailSettings.port } onChange={ (e) => { setMailSettings( { ...mailSettings, port:e.currentTarget.value } )  } }/>
                    </Form.Item>
                    <Form.Item
                        label="Kullanıcı Adı"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Hesap Kullanıcı Adını Girin',
                            },
                        ]}
                    >
                        <Input value={ mailSettings.username } onChange={ (e) => { setMailSettings( { ...mailSettings, username:e.currentTarget.value } )  } }/>
                    </Form.Item>
                    <Form.Item
                        label="Hesap Şifresi"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Hesap Şifresini Girin',
                            },
                        ]}
                    >
                        <Input value={ mailSettings.password } onChange={ (e) => { setMailSettings( { ...mailSettings, password:e.currentTarget.value } )  } }/>
                    </Form.Item>
                    <Form.Item>
                        <ButtonComponent htmlType="submit" type='primary' style={{ backgroundColor:'green' }} > SMTP Bilgilerini Kaydet </ButtonComponent>
                    </Form.Item>
                </Form>
            </Modal>

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
                            description: request.message ? request.message :  'Bir Hata oluştu',
                            message:'Hata'
                        } );
                    }
                } }> Yolla </ButtonComponent>
            </Modal>
        </div>
    )
}
export default MailSettingsComponent;