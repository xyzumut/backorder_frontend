import React  from 'react';
import { Badge, Table, Button, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { deleteInfoAPI } from '../../../services';

const TableComponent = ( { selected, setSelected, domains, loading, query, setQuery, initialQuery } ) => {

    const deleteInfo = async ( id ) => {
        const deleteRequest = await deleteInfoAPI( '/information/delete/'+id );
        console.log( ' Silme isteği sonucu : ', deleteRequest );
    }

    const expandableColumns = {

        socialColumn: [
            { title:'Sosyal Medya', dataIndex:'info'},
            { title:'Kaynak', key:'source', render: ( val ) => <a href={ '//'+val.source } target='_blank' > { val.source } </a> },
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } onClick={ () => { deleteInfo( value.id ) } }/> ) } 
            }
        ],
        mailColumn : [
            { title:'Mail', dataIndex:'info' },
            { title:'Kaynak', dataIndex:'source' }, 
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } onClick={ () => { deleteInfo( value.id ) } }/> ) } 
            }
        ],
        telColumn: [
            { title:'Telefon Numarası', dataIndex:'info'},
            { title:'Kaynak', dataIndex:'source' }, 
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } onClick={ () => { deleteInfo( value.id ) } }/> ) } 
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
                total: domains && domains.meta && domains.meta.filteredDataCount ? domains.meta.filteredDataCount : 0, 
                position: [ 'none' , 'bottomRight' ],
                current:query.page,
                pageSize:query.pagePerSize,
                onChange: ( page, pageSize ) => {
                    setQuery( { ...query, page:page, pagePerSize:pageSize } );
                }
            }}
            bordered = { true }                
            expandable = { expandable } 
            columns={ columns }
            dataSource={ domains.data || [] }
            rowSelection={ rowSelection }
            loading = { loading }
            style={ { width:1200 } }
            scroll={ { y:600 } }
            size='medium'
        />
        
    );
};
export default TableComponent;