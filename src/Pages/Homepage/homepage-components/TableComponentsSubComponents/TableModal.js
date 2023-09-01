import { Modal, DatePicker, Button, Input, Table } from "antd"
import React from "react"
import throwNotification from "../../../../general/throwNotifiaction";
import ButtonComponent from "../../../../general/ButtonComponent";
import { deleteInfoAPI } from "../../../../services";
import { useHomePage } from "../../../../context/homepage-context";

const TableModal = ( { domainData, setDomainData, setTableModalIsVisible, tableModalIsVisible } ) => {

    const { data, setData } = useHomePage()
    

    const deleteInfo = async ( value ) => {
        const request = await deleteInfoAPI( '/information/delete/'+value.id );
        if( request.status ) {

            const newInfos = data.find( item => item.key === value.parent ).infos.filter( item => item.id !== value.key );
            setData( data.map( item => {
                if ( item.key === value.parent ) {
                    item.infos = newInfos;
                }
                return item;
            } ) )
            setDomainData( { ...domainData, infos: newInfos } );
            throwNotification( {
                duration:2,
                type:'success',
                description:'Silme İşlemi Başarılı',
                message:'Başarılı'
            } );
        }
        else{
            throwNotification( {
                type:'error',
                description:'Silme İşlemi Başarısız',
                message:'Başarısız'
            } );
        }
    }

    return(
        <Modal 
            title={ `${domainData.domain} için bulunanlar` } 
            open = { tableModalIsVisible } 
            footer = { [] } 
            onCancel = { () => { setTableModalIsVisible( false ) } }
            width={1000}
        >
            <Table 
                columns={ [
                    { 
                        title:'Kaynak',
                        key:'source',
                        align:"center",
                        render:( props ) => { return <a target="_blank" href={ '//'+props.source }>{props.source}</a> }
                    },
                    {
                        title:'Veri',
                        dataIndex:'info',
                    },
                    // {
                    //     title:'#',
                    //     key:'delete',
                    //     width:120,
                    //     render: ( props ) => {
                    //         // props.id
                    //         return <ButtonComponent type="primary" danger onClick = { async () => { await deleteInfo( props ) } }> Sil </ButtonComponent>
                    //     }
                    // }
                ]}
                dataSource={ domainData.infos || [] }
                style           = { { width:1000 } }
                scroll          = { { y:500 } }
                size            = 'medium'
                pagination = {{
                    total: domainData.infos && domainData.infos.length ? domainData.infos.length : 0 , 
                    position: [ 'none' , 'bottomRight' ],
                    pageSize:20,
                }}
            />
        </Modal>  
    )
}
export default TableModal;