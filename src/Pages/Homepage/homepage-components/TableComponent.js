import React  from 'react';
import { Badge, Table, Button, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const TableComponent = ( { selected, setSelected, data, loading } ) => {
    
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
                        style = { { width : '25%' } }
                        columns = { [ { title:'Sosyal Medya', dataIndex:'social', width:'75%' }, { title:'#', key:'action', width:'25%', render:() => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } /> ) } } ] }
                        dataSource = { [ { key:1, social:record.domain+'instagram' }, { key:2, social:record.domain+'facebook' }, { key:3, social:record.domain+'twitter' } ] }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '45%' } }
                        columns = { [ { title:'Mail', dataIndex:'mail' }, { title:'#', dataIndex:'action' } ] }
                        dataSource = { [ { key:1, mail:record.domain+'mail1' }, { key:2, mail:record.domain+'mail2' }, { key:3, mail:record.domain+'mail3' } ] }
                    />
                    <Table
                        scroll={ { y:200 } }
                        bordered = { true }
                        size = 'small'
                        pagination = { false } 
                        style = { { width : '25%' } }
                        columns = { [ { title:'Telefon Numarası', dataIndex:'tel', width:'75%' }, { title:'#', key:'action', width:'25%', render:() => { return( <Button loading = { false } danger icon={ <DeleteOutlined/> } /> ) } } ] }
                        dataSource = { [ { key:1, tel:record.domain+'tel1' }, { key:2, tel:record.domain+'tel2' }, { key:3, tel:record.domain+'tel3' }, { key:4, tel:record.domain+'tel4' }, { key:5, tel:record.domain+'tel5' } ] }
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
            style={ { width:1000 } }
            scroll={ { y:700 } }
            size='medium'
        />
        
    );
};
export default TableComponent;