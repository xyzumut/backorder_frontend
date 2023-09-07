import { Table } from "antd";
import React from "react"

const GovTrTableComponent = ( { data } ) => {


    return(
        <Table 
            scroll  = { { y:550 } }
            style   = { { width:700 } }
            columns = { [ 
                {
                    title: 'Adres',
                    dataIndex: 'siteAdress',
                    align:'center',
                },
                {
                    title:'Ünvan',
                    dataIndex: 'companyTitle',
                    align:'center'
                },
                {
                    title:'VkNo',
                    dataIndex: 'vkNo',
                    align:'center'
                },
                {
                    title:'Mersis',
                    dataIndex: 'mersisNo',
                    align:'center'
                }
            ]}
            dataSource={ data.govTrResult || [] }
        />
    );
}
export default GovTrTableComponent;