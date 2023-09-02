import { motion } from "framer-motion";
import React from "react";
import MailTemplateComponent from "./mailppage-components/MailTemplate";

const MailPage = () => {

    const [ template, setTemplate ] = React.useState( {
        mailHeader      :'',
        mailContent     :'',
        mailButtonText  :'',
        mailFooter1     :'',
        mailFooter2     :'',
        facebook        :'',
        twitter         :'',
        linkedin        :'',
        socialMedia:{
            facebook    :true,
            twitter   :true,
            linkedin    :true
        }
    })
    
    const [ loading, setLoading ] = React.useState();

    return (
        <motion.div
            initial = {{ opacity:0, translateY:100 }}
            animate = {{ opacity:1, translateY:0   }}
            style={{ width:1200, height:800, margin:'20px auto', display:'flex' }}
        > 
            <div style={{ width:400, height:800 }}> 

            </div>
            <div style={{ overflowY:"auto", overflowX:"hidden", width:800, height:800 }}>
                <MailTemplateComponent template = { template } setTemplate = { setTemplate } width={800} />
            </div>

        </motion.div>)
}
export default MailPage;