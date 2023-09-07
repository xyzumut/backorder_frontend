import { Modal, Table } from "antd"
import React from "react"

const TableModal = ( { domainData, setTableModalIsVisible, tableModalIsVisible } ) => {


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
                        render:( props ) => { return <a rel="noreferrer" target="_blank" href={ '//'+props.source }>{props.source}</a> }
                    },
                    {
                        title:'Veri',
                        dataIndex:'info',
                    },
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