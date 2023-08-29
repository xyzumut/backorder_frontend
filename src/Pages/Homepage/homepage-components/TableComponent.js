import React  from 'react';
import { Badge, Table, Button, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const TableComponent = ( { selected, setSelected, data, loading } ) => {
    
    const expandableColumns = {

        socialColumn: [
            { title:'Sosyal Medya', dataIndex:'social'},
            { title:'Kaynak', dataIndex:'src' },
            { 
                title:'#', 
                key:'action', 
                width:50, 
                render:() => {
                    return( <Button loading = { false } danger icon={ <DeleteOutlined/> } /> ) 
                } 
            }
        ],
        mailColumn : [
            { title:'Mail', dataIndex:'mail' },
            { title:'Kaynak', dataIndex:'src' }, 
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } onClick={ () => {  } }/> ) } 
            }
        ],
        telColumn: [
            { title:'Telefon Numarası', dataIndex:'tel'},
            { title:'Kaynak', dataIndex:'src' }, 
            { 
                title:'#', 
                key:'action', 
                width:50, 
                render:() => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } /> ) } 
            }
        ]
    }

    const defaultExpandable = {
        expandedRowRender: ( record ) => {
            return (
                <div style={ { display:'flex', justifyContent:'space-between' } }>
                    <Table
                        scroll={ { y:200 } }
                        loading = { !true }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '30%' } }
                        columns = { expandableColumns.socialColumn }
                        dataSource = { [ { key:1, social:record.domain+'instagram', src:'KaynakDomain' }, { key:2, social:record.domain+'facebook', src:'KaynakDomain' }, { key:3, social:record.domain+'twitter', src:'KaynakDomain' } ] }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '35%' } }
                        columns = { expandableColumns.mailColumn }
                        dataSource = { [ { key:1, mail:record.domain+'mail1', src:'KaynakDomain' }, { key:2, mail:record.domain+'mail2', src:'KaynakDomain' }, { key:3, mail:record.domain+'mail3', src:'KaynakDomain' } ] }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '30%' } }
                        columns = { expandableColumns.telColumn }
                        dataSource = { [ { key:1, tel:record.domain+'tel1', src:'KaynakDomain' }, { key:2, tel:record.domain+'tel2', src:'KaynakDomain' }, { key:3, tel:record.domain+'tel3', src:'KaynakDomain' }, { key:4, tel:record.domain+'tel4', src:'KaynakDomain' }, { key:5, tel:record.domain+'tel5', src:'KaynakDomain' } ] }
                    />
                </div>
            )
        },
    };

    // eslint-disable-next-line
    const [expandable, setExpandable] = React.useState(defaultExpandable);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            width:50,
            align:'center',
        },
        {
            title: () => <span onClick={ () => {
                console.log( 'domaine göre sıralama isteği atıldı' )
            } }>Domain</span>,
            key: 'domain',
            render: ( props ) => {
                return <NavLink to={ '/'+props.domain } > { props.domain } </NavLink>
            }
        },
        {
            title: () => <span onClick={ () => {
                console.log( 'düşüş tarihi sıralama isteği atıldı' )
            } }>Düşüş tarihi</span>,
            dataIndex: 'dropdate',
            width:150,
            align:'center'
        },
        {
            title:'Durum',
            key: 'status',
            width:150,
            render: ( props ) => {
                // console.log( 'props : ', props );
                return( props.status ? <Badge status='success' text="Tamamlandı" /> : <Badge status='processing' text="Kuyrukta" /> ) 
            },
        },
        {
            title: '#',
            key: 'action',
            width:150,
            render: ( props ) => {
                // ilgili satırın elemanları aynen geliyor buraya
                // console.log( 'etiket', props )
                const content = () => {
                    return( 
                        <div>
                            <Button type="primary" style={{ marginLeft:10, backgroundColor:'green' }} loading = { false }>
                                Onayla
                            </Button>

                            <Button type="primary" style={{ marginLeft:10 }} loading = { false }>
                                Mail Gönder
                            </Button>
                            
                            <Button type="primary" style={{ marginLeft:10 }} loading = { false }>
                                Sıraya Al
                            </Button>

                            <Button type="primary" style={{ marginLeft:10 }} loading = { false } danger icon={ <DeleteOutlined/> } />
                        </div>
                    )
                }
                return (
                    <Popover content={content} title="" trigger="click" placement='bottom'>
                        <Button>Aksiyonlar</Button>
                    </Popover>
                )
            },
        },
    ];


    React.useEffect( () => {
        console.log( selected )
    }, [selected] )

    const [ page, setPage ] = React.useState(1);
    const [ pageSize, setPageSize ] = React.useState(10);

    const rowSelection = {
        onChange: ( selectedRowKeys, selectedRows ) => {
            setSelected( selectedRows )
        },
        getCheckboxProps: (record) => ({
            domain: record.domain, // bunun ne işe yaradığını anlamadım
        }),
    };

    return (
        <Table
            pagination = {{
                position: [ 'none' , 'bottomRight' ],
                current:page,
                pageSize:20,
                onChange: ( page, pageSize ) => {
                    setPage( page )
                    setPageSize( pageSize )
                    console.log( page, pageSize )
                }
            }}
            bordered = { true }                
            expandable = { expandable } 
            columns={ columns }
            dataSource={ data }
            rowSelection={ rowSelection }
            loading = { loading }
            style={ { width:1200 } }
            scroll={ { y:600 } }
            size='medium'
        />
        
    );
};
export default TableComponent;