import React  from 'react';
import { Badge, Table, Button, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const TableComponent = ( { selected, setSelected, data, loading, query, setQuery, initialQuery } ) => {



    const expandableColumns = {

        socialColumn: [
            { title:'Sosyal Medya', dataIndex:'info'},
            { title:'Kaynak', dataIndex:'source' },
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
            { title:'Mail', dataIndex:'info' },
            { title:'Kaynak', dataIndex:'source' }, 
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } onClick={ () => {  } }/> ) } 
            }
        ],
        telColumn: [
            { title:'Telefon Numarası', dataIndex:'info'},
            { title:'Kaynak', dataIndex:'source' }, 
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
                        dataSource = { !( record.infos.length > 0 ) ? [] : record.infos.filter( item => item.type === 'social_link' ).map( item => { return { key:item.id, ...item  } } )  }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '35%' } }
                        columns = { expandableColumns.mailColumn }
                        dataSource = { !( record.infos.length > 0 ) ? [] : record.infos.filter( item => item.type === 'mail' ).map( item => { return { key:item.id, ...item  } } )  }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '30%' } }
                        columns = { expandableColumns.telColumn }
                        dataSource = { !( record.infos.length > 0 ) ? [] : record.infos.filter( item => item.type === 'tel' ).map( item => { return { key:item.id, ...item  } } )  }
                    />
                </div>
            )
        },
    };

    // eslint-disable-next-line
    const [expandable, setExpandable] = React.useState( defaultExpandable );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            width:100,
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
            dataIndex: 'dropDate',
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
            dataSource={ data.domains || [] }
            rowSelection={ rowSelection }
            loading = { loading }
            style={ { width:1200 } }
            scroll={ { y:600 } }
            size='medium'
        />
        
    );
};
export default TableComponent;