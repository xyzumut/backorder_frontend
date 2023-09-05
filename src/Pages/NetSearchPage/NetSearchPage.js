import { Form, Input, Spin } from "antd";
import { motion } from "framer-motion";
import React from "react";
import ButtonComponent from "../../general/ButtonComponent";
import throwNotification from "../../general/throwNotifiaction";
import { addGoogleFieldsAPI, getGoogleFieldsAPI } from "../../services";


const NetSearchPage = () => {

    const [ googleApiData, setGoogleApiData ] = React.useState( { apiKey:'', cx:'' } );
    const [ loading, setLoading ] = React.useState( false );

    const [fields, setFields] = React.useState([
        {
          name: ['apikey'],
          value: '',
        },
        {
            name: ['cx'],
            value: '',
        },
    ]);
    const handleAddGoogleFields = async () => {

        if ( googleApiData.cx.trim === '' || googleApiData.apiKey.trim === '' ) {
            throwNotification( {
                description:'Eksik Bilgi Girildi',
                duration:3,
                message:'Eksik',
                type:'warning'
            } );
            return;
        }

        const request = await addGoogleFieldsAPI( { endpoint:'/options/google', rawData:JSON.stringify( googleApiData ) } );

        if ( request.status === true ) {
            throwNotification( {
                description:'İşlem Başarılı',
                duration:2,
                message:'Başarılı',
                type:'success'
            });
        }
        else{
            throwNotification( {
                description:request.message ? request.message : 'Bilgileri kaydetmeye çalışırken bir hata oluştu',
                duration:4,
                message:'Hata',
                type:'error'
            });
        }
    }

    const getNetData = async () => {
        setLoading( true );
        const request = await getGoogleFieldsAPI( '/options/google' );
        if ( request.status === true ) {
            throwNotification( {
                description:'Kayıtlar getirildi',
                duration:2,
                message:'Başarılı',
                type:'success'
            });
            // setGoogleApiData( { apiKey:request.data.apiKey, cx:request.data.cx } );
            setFields( [ {name:['apikey'], value:request.data.apiKey}, {name:['cx'], value:request.data.cx} ] )
        }
        else{
            throwNotification( {
                description:request.message ? request.message : 'Google Search API kayıtları getirilirken bir hata meydana geldi',
                duration:4,
                message:'Hata',
                type:'error'
            });
        }
        setLoading( false );
    }

    React.useEffect( () => {
        getNetData();
    }, []);

    return (
        <motion.div
            initial = {{ opacity:0, translateY:100 }}
            animate = {{ opacity:1, translateY:0   }}
        > 
            <div style={{ width:1000, height:800, backgroundColor:'white', margin:'50px auto' }}>

                <div style={{ padding:20, display:'flex', flexDirection:'column', width:500 }}>
                    <h3> Google Araması İçin API Bilgileri </h3>
                    {
                        !loading 
                        ?
                        <Form 
                            onFinish={ async () => { await handleAddGoogleFields(); } }
                            labelCol={{ span:7 }}
                            fields={fields}
                        >
                            <Form.Item
                                label="Google Api Key"
                                name="apikey"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Google Api keyi girin',
                                    },
                                ]}
                            >
                                <Input value={ googleApiData.apiKey } onChange={ (e) => { setGoogleApiData( { ...googleApiData, apiKey:e.currentTarget.value } ) } }/>
                            </Form.Item>
                            <Form.Item
                                label="Google CX Bilgisi"
                                name="cx"
                                rules={[
                                    {
                                        required: true,
                                        message: 'CX bilgisini girin',
                                    },
                                ]}
                            >
                                <Input value={ googleApiData.cx } onChange={ (e) => { setGoogleApiData( { ...googleApiData, cx:e.currentTarget.value } ) } }/>
                            </Form.Item>
                            <Form.Item>
                                <ButtonComponent htmlType="submit" type='primary' style={{ backgroundColor:'green', width:200 }} > Kaydet </ButtonComponent>
                            </Form.Item>
                        </Form>
                        :
                        <Spin/>
                    }
                </div>

            </div>
        </motion.div>)
}
export default NetSearchPage;


// <Input style={{ marginBottom:20, width:300 }} placeholder = "Google API Key'i gir" onChange={ (e) => { setGoogleApiData( { ...googleApiData, apiKey:e.currentTarget.value } ) } }/>
// <Input style={{ marginBottom:20, width:300 }} placeholder = "Google CX'i gir" onChange={ (e) => { setGoogleApiData( { ...googleApiData, cx:e.currentTarget.value } ) } }/>
// <ButtonComponent type='primary' style={{ backgroundColor:'green', width:200 }} onClick = { async () => { await handleAddGoogleFields(); } }> Kaydet </ButtonComponent>