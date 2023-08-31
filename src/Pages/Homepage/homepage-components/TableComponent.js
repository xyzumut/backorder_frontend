import React, { useEffect } from 'react';
import { Badge, Table, Button, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { addToQueueDomainAPI, deleteDomainAPI, deleteInfoAPI, domainApprovedToggleAPI } from '../../../services';
import { useHomePage } from '../../../context/homepage-context';
import throwNotification from '../../../general/throwNotifiaction';

const TableComponent = ( { selected, setSelected, loading, setLoading } ) => {
    
    const { data, setData, query, setQuery, meta, setMeta, initialQuery } = useHomePage()

    const deleteInfo = async ( value ) => {
        const request = await deleteInfoAPI( '/information/delete/'+value.id );
        setLoading( true );
        if( request.status ) {
            const newInfos = data.find( item => item.key === value.parent ).infos.filter( item => item.id !== value.key );
            setData( data.map( item => {
                if ( item.key === value.parent ) {
                    item.infos = newInfos;
                }
                return item;
            } ) )
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
        setLoading( false );
    }

    const deleteDomain = async ( domainID ) => {
        const request = await deleteDomainAPI( '/domain/delete/' + domainID );
        setLoading( true );
        if( request.status ) {
            setData( data.filter( item => item.key !== domainID ) );
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
        setLoading( false );
    }

    const addToQueue = async ( domainID ) => {
        const request = await addToQueueDomainAPI( '/domain/add-queue/' + domainID );
        setLoading( true );
        if( request.status ) {
            setData( data.filter( item => item.key !== domainID ) );
            throwNotification( {
                duration:2,
                type:'success',
                description:'Sıraya koyma işlemi Başarılı',
                message:'Başarılı'
            } );
        }
        else{
            throwNotification( {
                type:'error',
                description:'Sıraya koyma işlemi Başarısız',
                message:'Başarısız'
            } );
        }
        setLoading( false );
    }

    const domainApprovedToggle = async ( domainID ) => {
        const request = await domainApprovedToggleAPI( '/domain/toggle-approved/' + domainID );
        setLoading( true );
        if( request.status ) {
            setData( data.map( item => {
                if ( item.key !== domainID ) {
                    return item;
                }
                return { ...item, approved:true };
            } ) );
            throwNotification( {
                duration:2,
                type:'success',
                description:'Onay Değiştirme İşlemi Başarılı',
                message:'Başarılı'
            } );
        }
        else{
            throwNotification( {
                type:'error',
                description:'Onay Değiştirme İşlemi Başarısız',
                message:'Başarısız'
            } );
        }
        setLoading( false );
    }

    const expandableColumns = {

        socialColumn: [
            { title:'Sosyal Medya', dataIndex:'info'},
            { title:'Kaynak', key:'source', render: ( val ) => <a href={ '//'+val.source } target='_blank' > { val.source } </a> },
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button danger icon={ <DeleteOutlined/> } onClick={ () => { deleteInfo( value ) } }/> ) } 
            }
        ],
        mailColumn : [
            { title:'Mail', dataIndex:'info' },
            { title:'Kaynak', dataIndex:'source' }, 
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button danger icon={ <DeleteOutlined/> } onClick={ () => { deleteInfo( value ) } }/> ) } 
            }
        ],
        telColumn: [
            { title:'Telefon Numarası', dataIndex:'info'},
            { title:'Kaynak', dataIndex:'source' }, 
            { 
                title:'#', 
                key:'action', 
                width:50,
                render:( value ) => { return( <Button danger icon={ <DeleteOutlined/> } onClick={ () => { deleteInfo( value ) } }/> ) } 
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
                        dataSource = { !( record.infos.length > 0 ) ? [] : record.infos.filter( item => item.type === 'social_link' ).map( item => { return { parent:record.key, key:item.id, ...item, } } )  }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '35%' } }
                        columns = { expandableColumns.mailColumn }
                        dataSource = { !( record.infos.length > 0 ) ? [] : record.infos.filter( item => item.type === 'mail' ).map( item => { return { parent:record.key, key:item.id, ...item  } } )  }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '30%' } }
                        columns = { expandableColumns.telColumn }
                        dataSource = { !( record.infos.length > 0 ) ? [] : record.infos.filter( item => item.type === 'tel' ).map( item => { return { parent:record.key, key:item.id, ...item  } } )  }
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
                const content = () => {
                    return( 
                        <div>
                            <Button type="primary" style={{ marginLeft:10, backgroundColor:'green' }} loading = { false } onClick={ () => { domainApprovedToggle( props.key ) } } >
                                Onayla
                            </Button>

                            <Button type="primary" style={{ marginLeft:10 }} loading = { false }>
                                Mail Gönder
                            </Button>
                            
                            <Button type="primary" style={{ marginLeft:10 }} loading = { false } onClick={ () => { addToQueue( props.key ) } }>
                                Sıraya Al
                            </Button>

                            <Button type="primary" style={{ marginLeft:10 }} loading = { false } danger icon={ <DeleteOutlined/> } onClick={ () => { deleteDomain( props.key ) } } />
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

    }, [selected] )

    const rowSelection = {
        onChange: ( selectedRowKeys, selectedRows ) => {
            setSelected( selectedRows )
        },
        getCheckboxProps: (record) => ({
            domain: record, // bunun ne işe yaradığını anlamadım
        }),
    };

    return (
        <Table
            pagination = {{
                total: meta && meta.filteredDataCount ? meta.filteredDataCount : 0, 
                position: [ 'none' , 'bottomRight' ],
                current:query.page,
                pageSize:query.pagePerSize,
                onChange: ( page, pageSize ) => {
                    setQuery( { ...query, page:page, pagePerSize:pageSize } );
                }
            }}
            bordered = { true }                
            expandable = { expandable } 
            columns = { columns }
            dataSource = { data || [] }
            rowSelection = { rowSelection }
            loading = { loading }
            style = { { width:1200 } }
            scroll = { { y:600 } }
            size='medium'
        />
        
    );
};
export default TableComponent;