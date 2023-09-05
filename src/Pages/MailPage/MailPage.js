import { motion } from "framer-motion";
import React from "react";
import MailTemplateComponent from "./mailppage-components/MailTemplateComponent";
import MailSettingsComponent from "./mailppage-components/MailSettingsComponent";
import { getMailTemplateAPI } from "../../services";
import throwNotification from "../../general/throwNotifiaction";

const MailPage = () => {

    const [ template, setTemplate ] = React.useState( {
        mailHeader      :'Mail Başlığı',
        mailContent     :'Mail İçeriği',
        mailButtonText  :'Buton Yazısı',
        mailFooter1     :'Footer Yazısı 1',
        mailFooter2     :'Footer Yazısı 2',
    } )

    const getData = async () => {
        const request = await getMailTemplateAPI( '/options/template' );
        if ( request.status ) {
            setTemplate( {
                mailHeader      : request.data.mailHeader,
                mailContent     : request.data.mailContent, 
                mailButtonText  : request.data.mailButtonText, 
                mailFooter1     : request.data.mailFooter1,
                mailFooter2     : request.data.mailFooter2
            } );
            throwNotification( {
                duration:2,
                type:'success',
                description: 'Mail Şablonu Getirildi',
                message:'Başarılı'
            } );
        }
        else{
            throwNotification( {
                duration:5,
                type:'error',
                description: request.message ? request.message : 'Mail şablonu getirilirken bir hata oluştu',
                message:'Hata'
            } );
            setTemplate( {
                mailHeader      : '',
                mailContent     : '', 
                mailButtonText  : '', 
                mailFooter1     : '',
                mailFooter2     : ''
            } );
        }
    }

    React.useEffect( () => {
        getData();
    }, []) 

    return (
        <motion.div
            initial = {{ opacity:0, translateY:100 }}
            animate = {{ opacity:1, translateY:0   }}
            style={{ width:1200, height:800, margin:'20px auto', display:'flex' }}
        > 

            <div style={{ width:400, height:800, backgroundColor:'white' }}> 
                <MailSettingsComponent template = { template } setTemplate = { setTemplate } />
            </div>

            <div style={{ overflowY:"auto", overflowX:"hidden", width:800, height:800 }}>
                <MailTemplateComponent template = { template } setTemplate = { setTemplate } width={800} />
            </div>

        </motion.div>)
}
export default MailPage;