import { motion } from "framer-motion";
import { Input, Button, Modal, Form, Spin, Badge } from "antd";
import React from "react";
import ButtonComponent from "../../../general/ButtonComponent";
import { addMailTemplateAPI, getSMTPConfigAPI, sendTestMailAPI, setSMTPConfigAPI, getTestModeAPI, testModeToggleAPI, setMailTimerAPI, getMailTimerAPI } from "../../../services";
import throwNotification from "../../../general/throwNotifiaction";

const MailSettingsComponent = ({  template, setTemplate }) => {

    const [ mailTimer, setMailTimer ]                   = React.useState('');
    const [ smtpModalVisible, setSmtpModalVisible ]     = React.useState( false );
    const [ mailSettings, setMailSettings ]             = React.useState( { smtpServer:'', port:'', username:'', password:'', name:'' } );
    const [ testData, setTestData ]                     = React.useState( { testModeIsActive:false, testModeTarget:'' } );
    const [ mailSettingsFields, setMailSettingsFields ] = React.useState( [
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
        {
            name: ['name'],
            value: '',
        },
    ] );

    const handleSetMailTimer = async () => {
        const timerArray = mailTimer.split( ',' ).map( item => Number(item.trim()) );
        const request = await setMailTimerAPI( { endpoint:'/options/setTestMailTimer', rawData:JSON.stringify( { timerArray:timerArray } ) } ) ;
        if ( request.status ) {
            throwNotification( {
                duration:2,
                type: 'success',
                description: request.message || 'Mail Aralıkları kaydetme işlemi Başarılı',
                message:'Başarı'
            });
        }
        else{
            throwNotification( {
                duration:4,
                type: 'error',
                description: request.message || 'Mail Aralıkları kaydetme işlemi sırasında hata oluştu',
                message:'Hata'
            });
        }
    }

    const handleSetOpenTestMode = async (active) => {

        const rawData = JSON.stringify( { testModeIsActive:active ? 1 : 0, testModeTarget:testData.testModeTarget } );
        const request = await testModeToggleAPI( { endpoint:'/options/setTestOptions', rawData:rawData } );
        console.log( request.data.test_mode );
        if ( request.status && request.status === true ) {
            setTestData({ testModeIsActive:active, testModeTarget:testData.testModeTarget });
            throwNotification( {
                duration:3,
                type: 'success',
                description:'Test Modu güncellendi',
                message:'Başarı'
            });
        }
        else{
            throwNotification( {
                duration:3,
                type: 'error',
                description: request.message || 'Test Modu ile alakalı bir hata oluştu',
                message:'Hata'
            });
        }
    }

    const getTestMode = React.useCallback( async () => {
        const request = await getTestModeAPI('/options/getTestOptions');
        if ( request && request.status === true ) {
            setTestData( { testModeTarget:request.data.test_mode_target, testModeIsActive:Number(request.data.test_mode) === 1 ? true : false } );
        }
        else{
            throwNotification( {
                duration:3,
                type: 'danger',
                description: request.message || 'Test modu açılırken bir hata oluştu',
                message:'Hata'
            } );
        }
    }, [])

    const getMailTimer = async () => {
        const request = await getMailTimerAPI('/options/getTestMailTimer');
        if ( request && request.status === true ) {
            setMailTimer( request.data );
        }
        else{
            throwNotification( {
                duration:3,
                type: 'danger',
                description: 'Mail Aralıkları Getirilirken Hata Oluştu',
                message:'Hata'
            } );
        }
    }

    React.useEffect( () => {
        getTestMode();
    }, [getTestMode])


    React.useEffect( () => {
        getMailTimer();
    }, [])

    return(
        <div style={{ width:400, height:800, display:'flex', paddingTop:100, paddingLeft:50, flexDirection:'column' }}>

            <div style={{ width:400, height:100 }}>
                Mail Atma Aralıkları: <Input style={{width:200}} value={mailTimer} onChange={(e) => { setMailTimer(e.currentTarget.value) }}/> 
                <ButtonComponent type="primary" style={{backgroundColor:'green', marginTop:20}} onClick={ async () => { await handleSetMailTimer() } }> Aralıkları Kaydet </ButtonComponent>
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
                <div style={{ color:'gray' }}>
                    Domainin Bitiş tarihi : <span style={{ color:'black', fontWeight:800, cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %bitis% </span>
                </div>
                <div style={{ color:'gray' }}>
                    Domainin Kayıt tarihi : <span style={{ color:'black', fontWeight:800, cursor:'pointer' }} onClick={ ( e ) => { navigator.clipboard.writeText( e.currentTarget.innerText ) } }> %kayit% </span>
                </div>
            </div>

            <ButtonComponent type="primary" style={{width:'55%', marginTop:20}} onClick = { async () => { 
                
                const request = await getSMTPConfigAPI( '/options/getconfig' );

                if ( request.status === true ) {
                    if ( request.data && request.data.username ) {
                        const data = request.data;
                        setMailSettingsFields( [ 
                            { name:'username',   value:data.username    }, 
                            { name:'password',   value:data.password    }, 
                            { name:'port',       value:data.port        }, 
                            { name:'smtpServer', value:data.smtpServer  },
                            { name:'name'      , value:data.name        }
                        ]);
                        setMailSettings( {
                            name       : data.name,
                            password   : data.password,
                            port       : data.port,
                            smtpServer : data.smtpServer,
                            username   : data.username
                        });
                    }
                    else{
                        throwNotification( { 
                            description:request.message || 'Henüz smtp bilgisi girilmemiş, smtp bilgisi girin',
                            duration:2,
                            message:'Bilgi',
                            type:'info'
                        } )
                    }
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

            <ButtonComponent style={{ marginTop:20, marginBottom:20, width:'50%', borderColor:(testData.testModeIsActive ? 'green' : 'red')  }} onClick = { async (e) => { await handleSetOpenTestMode( !testData.testModeIsActive ) } } >
                <Badge color={ testData.testModeIsActive ? 'green' : 'red' } text={ testData.testModeIsActive ? 'Test Modu Aktif' : 'Test Modu Pasif' } style={{ color:testData.testModeIsActive ? 'green' : 'red' }}/>
            </ButtonComponent>
            { 
                testData.testModeIsActive 
                && 
                <motion.div initial = {{ opacity:0 }} animate = {{ opacity:1 }}> 
                    <Input placeholder="Hedef Test Maili" value={testData.testModeTarget} onChange={ async (e) => { setTestData( { testModeIsActive:testData.testModeIsActive, testModeTarget:e.currentTarget.value } ) } } /> 
                    <ButtonComponent style={{ marginTop:20 }} type="primary" onClick= { async (e) => { await handleSetOpenTestMode( testData.testModeIsActive ) } }> Kaydet </ButtonComponent>
                </motion.div> 
            }
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
                                smtpServer  :mailSettings.smtpServer || '', 
                                username    :mailSettings.username || '', 
                                password    :mailSettings.password || '', 
                                port        :mailSettings.port || '',
                                name        :mailSettings.name || ''
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
                    <Form.Item
                        label="Mailde Görülecek İsim"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Mailde Görülecek İsmi Girin',
                            },
                        ]}
                    >
                        <Input value={ mailSettings.name } onChange={ (e) => { setMailSettings( { ...mailSettings, name:e.currentTarget.value } )  } }/>
                    </Form.Item>
                    <Form.Item>
                        <ButtonComponent htmlType="submit" type='primary' style={{ backgroundColor:'green' }} > SMTP Bilgilerini Kaydet </ButtonComponent>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default MailSettingsComponent;