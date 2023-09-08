import { motion } from "framer-motion";
import { Input, Button, Modal, Form, Spin, Badge } from "antd";
import React from "react";
import ButtonComponent from "../../../general/ButtonComponent";
import { addMailTemplateAPI, getSMTPConfigAPI, sendTestMailAPI, setSMTPConfigAPI, getTestModeAPI, setTestModeAPI } from "../../../services";
import throwNotification from "../../../general/throwNotifiaction";
import { InputNumber } from 'antd';
import debounce from "lodash.debounce";

const MailSettingsComponent = ({  template, setTemplate }) => {

    const [ loading, setLoading ] = React.useState( true );
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


    const handleSetOpenTestMode = async () => {
        request = await setTestModeAPI( { endpoint:'options/setTestOptions', rawData:JSON.stringify( {} ) } )
    }

    const handleGetTestMode = React.useCallback( async () => {
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

    const debouncedHandle = React.useMemo(() => {
        return debounce( async (value) => {
            setTestData( { ...testData, testModeTarget:value } );
            console.log( value )
        }, 750);
    }, [testData]);

    const handleTestTargetInput = async ( val ) => {
        debouncedHandle(val)
    }

    React.useEffect(() => {
        return () => {
            debouncedHandle.cancel();
        };
    }, [debouncedHandle]);
    
    React.useEffect( () => {
        handleGetTestMode();
    }, [handleGetTestMode])

    return(
        <div style={{ width:400, height:800, display:'flex', paddingTop:100, paddingLeft:50, flexDirection:'column' }}>

            <div style={{ width:400, height:100 }}>
                Kaç gün öncesine mail atsın? : { true ?  <InputNumber/> : <Spin/> }
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

            <ButtonComponent style={{ marginTop:20, marginBottom:20, width:'50%', borderColor:(testData.testModeIsActive ? 'green' : 'red')  }} onClick = { async () => { await handleSetOpenTestMode() } } >
                <Badge color={ testData.testModeIsActive ? 'green' : 'red' } text={ testData.testModeIsActive ? 'Test Modu Aktif' : 'Test Modu Pasif' } style={{ color:testData.testModeIsActive ? 'green' : 'red' }}/>
            </ButtonComponent>
            { 
                testData.testModeIsActive 
                && 
                <motion.div initial = {{ opacity:0 }} animate = {{ opacity:1 }}> 
                    <Input placeholder="Hedef Test Maili" onChange={ async (e) => { await handleTestTargetInput( e.currentTarget.value ) } } /> 
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