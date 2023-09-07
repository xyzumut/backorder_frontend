import React from 'react';
import { Badge, Table, Button, Popover, Switch } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { addToQueueDomainAPI, deleteDomainAPI, domainApprovedToggleAPI, sendMailForcedAPI } from '../../../services';
import { useHomePage } from '../../../context/homepage-context';
import throwNotification from '../../../general/throwNotifiaction';
import TableModal from './TableComponentsSubComponents/TableModal';
import ButtonComponent from '../../../general/ButtonComponent';

const TableComponent = ( { setSelected, loading, setLoading } ) => {
    
    const { data, setData, query, setQuery, meta } = useHomePage()

    const [ tableModalData, setTableModalData ]           = React.useState( [] );
    const [ tableModalIsVisible, setTableModalIsVisible ] = React.useState( false );

    const deleteDomain = async ( domainID ) => {
        const request = await deleteDomainAPI( '/domain/delete/' + domainID );
        setLoading( true );
        if( request.status ) {
            if ( meta.pagePerSize > 10 ) {
                setData( data.filter( item => item.key !== domainID ) );
            }
            else{
                setQuery( { ...query } )
            }
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
            if ( meta.pagePerSize > 10 ) {
                setData( data.filter( item => item.key !== domainID ) );
            }
            else{
                setQuery( { ...query } )
            }

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

                return { ...item, status:request.data};
            } ) );
            throwNotification( {
                duration:5,
                type:'success',
                description:request.message,
                message:'Başarılı'
            } );
            setLoading( false );
            return true;
        }
        else{
            throwNotification( {
                type:'error',
                description:'Onay Değiştirme İşlemi Başarısız',
                message:'Başarısız'
            } );
            setLoading( false );
            return false;
        }
    }

    const sendMailForced = async ( domainID ) => {

        const request = await sendMailForcedAPI( '/mail/sendMail/'+domainID );

        if ( request.status && request.status === true ) {
            throwNotification( {
                duration:4,
                type:'success',
                description: request.message || 'Mail Atma İşlemi Başarılı',
                message:'Başarılı'
            });
        }
        else{
            throwNotification( {
                duration:4,
                type:'error',
                description: request.message || 'Mail Atma İşlemi Başarısız',
                message:'Başarısız'
            });
        }

    }

    const openTableModal = ( props ) => {
        setTableModalData( { ...props, infos:props.infos.map( item => { return { ...item, key:item.id, parent:props.key } } ) } );
        setTableModalIsVisible( true );
    }

    const StatusBadge = ( {status} ) => {
        console.log( status );
        let element = <Badge status='error' text='Hata'/>;
        switch ( status ) {
            case 'pending_queue':
                element = <Badge status='default' text='Bekliyor'/>;
                break;
            case 'in_queue':
                element = <Badge status='processing' text='Kuyrukta'/>;
                break;
            case 'pending_approve':
                element = <Badge color='orange' text='Onay Bekliyor'/>;
                break;
            case 'pending_mail':
                element = <Badge color='geekblue' text='Mail Bekliyor'/>;
                break;
            case 'completed':
                element = <Badge status='success' text='Tamamlandı'/>;
                break;
            case 'no-info':
                element = <Badge status='default' text='Bilgi Bulunamadı'/>;
                break;
            default:
                break;
        }
        return element;
    }

    const columns = [
        {
            title: () => <span style={{ cursor:'pointer', color: query.sortBy === 'id' ? ( query.orderBy === 'ASC' ? 'green' : 'red' ) : 'black'}} onClick={ () => {
                setQuery( { ...query, sortBy:'id', orderBy: query.sortBy === 'id' ? ( query.orderBy === 'ASC' ? 'DESC' : 'ASC' ) : query.orderBy } );

            }}>ID</span>,
            dataIndex: 'key',
            width:100,
            align:'center',
        },
        {
            title: () => <span style={{ cursor:'pointer', color: query.sortBy === 'domain' ? ( query.orderBy === 'ASC' ? 'green' : 'red' ) : 'black'}} onClick={ () => {
                setQuery( { ...query, sortBy:'domain', orderBy: query.sortBy === 'domain' ? ( query.orderBy === 'ASC' ? 'DESC' : 'ASC' ) : query.orderBy } );
            } }>Domain</span>,
            key: 'domain',
            render: ( props ) => {
                return <NavLink to={ '/kayit/'+props.domain } > { props.domain } </NavLink>
            }
        },
        {
            title: () => <span style={{ cursor:'pointer', color: query.sortBy === 'drop_date' ? ( query.orderBy === 'ASC' ? 'green' : 'red' ) : 'black'}} onClick={ () => {
                setQuery( { ...query, sortBy:'drop_date', orderBy: query.sortBy === 'drop_date' ? ( query.orderBy === 'ASC' ? 'DESC' : 'ASC' ) : query.orderBy } );
            } }>Düşüş tarihi</span>,
            dataIndex: 'dropDate',
            width:150,
            align:'center'
        },
        {
            title: 'Onay',
            key: 'status',
            width:150,
            align:'center',
            render: ( props ) => {
                return(
                    <Switch 
                        disabled = { props.status   === 'pending_queue' || props.status   === 'in_queue' || props.status   === 'no-info' }
                        checked  = { props.status === 'pending_mail'  || props.status === 'completed' }
                        onChange = { async () => {
                            await domainApprovedToggle( props.key );
                        }}
                    />
                )
            }
        },
        {
            title: () => <span style={{ cursor:'pointer', color: query.sortBy === 'status' ? ( query.orderBy === 'ASC' ? 'green' : 'red' ) : 'black'}} onClick={ () => {
                setQuery( { ...query, sortBy:'status', orderBy: query.sortBy === 'status' ? ( query.orderBy === 'ASC' ? 'DESC' : 'ASC' ) : query.orderBy } );
            } }> Durum </span>,
            key: 'status',
            width:150,
            render: ( props ) => {
                return <StatusBadge key={props.key} status={props.status} /> 
            },
        },
        {
            title: 'Ayrıntılar',
            key: 'key',
            width:100,
            align:'center',
            render: (props) => {
                return <Button type='primary' onClick={ () => { openTableModal( props ) } }> <PlusOutlined/> </Button>
            }
        },
        {
            title: '#',
            key: 'action',
            width:150,
            render: ( props ) => {
                const content = () => {
                    return( 
                        <div>
                            <ButtonComponent type="primary" style={{ marginLeft:10 }} onClick = { async () => { await sendMailForced( props.key ) } } >
                                Mail Gönder
                            </ButtonComponent>
                            
                            <ButtonComponent type="primary" style={{ marginLeft:10 }} onClick={ async () => { await addToQueue( props.key ) } }>
                                Sıraya Al
                            </ButtonComponent>

                            <ButtonComponent type="primary" style={{ marginLeft:10 }} danger icon={ <DeleteOutlined/> } onClick={ async () => { await deleteDomain( props.key ) } } />
                        </div>
                    )
                }
                return (
                    <Popover content={content} title="" trigger="hover" placement='bottom'>
                        <Button>Aksiyonlar</Button>
                    </Popover>
                )
            },
        },
    ];

    const rowSelection = {
        onChange: ( selectedRowKeys, selectedRows ) => {
            setSelected( selectedRows )
        },
        getCheckboxProps: (record) => ({
            domain: record, // bunun ne işe yaradığını anlamadım
        }),
    };

    return (
        <>
            <Table
                bordered        = { true }                
                columns         = { columns }
                dataSource      = { data || [] }
                rowSelection    = { rowSelection }
                loading         = { loading }
                style           = { { width:1200 } }
                scroll          = { { y:600 } }
                size            = 'medium'
                pagination = {{
                    total: meta && meta.filteredDataCount ? meta.filteredDataCount : 0, 
                    position: [ 'none' , 'bottomRight' ],
                    current:query.page,
                    pageSize:query.pagePerSize || 10,
                    onChange: ( page, pageSize ) => {
                        setQuery( { ...query, page:page, pagePerSize:pageSize } );
                    }
                }}
            />
            <TableModal 
                domainData = { tableModalData } 
                setDomainData = { setTableModalData } 
                tableModalIsVisible = { tableModalIsVisible } 
                setTableModalIsVisible = { setTableModalIsVisible } 
            />
        </>
    );
};
export default TableComponent;