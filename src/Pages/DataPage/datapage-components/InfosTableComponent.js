import { Select, Table } from "antd";
import React from "react"
import ButtonComponent from "../../../general/ButtonComponent";
import { deleteInfoAPI, deleteInfoMultipleAPI } from "../../../services";
import throwNotification from "../../../general/throwNotifiaction";

const InfosTableComponent = ( { data, setData, selectedInfos, setSelectedInfos } ) => {

    const rowSelection = {
        onChange: ( selectedRowKeys, selectedRows ) => {
            setSelectedInfos( selectedRowKeys )
        },
        getCheckboxProps: (record) => ({
            domain: record, // bunun ne işe yaradığını anlamadım
        }),
    };
    const [ optionWidth, setOptionWidth ] = React.useState(300);
    const [ result, setResult ]           = React.useState( data.infos || [] );

    const options = [
        { value:'1', label:'Mailler' },
        { value:'2', label:'Telefonlar' },
        { value:'4', label:'Sosyal Medya Linkleri' },
    ];

    const handleChangeOption = ( value ) => {

        setOptionWidth( value.length > 2 ? 370 : 320 );

        let optionIndex = 0;

        value.forEach( val => { optionIndex += Number(val) } );

        switch (optionIndex) {
            case 1:
                setResult( data.infos.filter( item => item.type.includes('mail') ) );
                break;
            case 2:
                setResult( data.infos.filter( item => item.type.includes('tel') ) );
                break;
            case 4:
                setResult( data.infos.filter( item => item.type.includes('social') ) );
                break;
            case 3:
                setResult( data.infos.filter( item => item.type.includes('mail') || item.type.includes('tel') ) );
                break;
            case 5:
                setResult( data.infos.filter( item => item.type.includes('mail') || item.type.includes('social') ) );
                break;
            case 6:
                setResult( data.infos.filter( item => item.type.includes('tel') || item.type.includes('social') ) );
                break;
            default:
                setResult( data.infos );
                break;
        }
    }

    const deleteSelectedRows = async () => {

        if ( selectedInfos.length === 0 ) {
            throwNotification( {
                duration:3,
                type:'warning',
                description: 'Önce satır seçmelisin',
                message:'Eksik'
            } );
            return
        }

        const request = await deleteInfoMultipleAPI( { endpoint:'/information/delete', rawData:JSON.stringify({ids:selectedInfos}) } );
        if ( request.status && request.status === true ) {
            throwNotification( {
                duration:5,
                type:'success',
                description: request.message,
                message:'Başarılı'
            } );
            setData( { ...data, infos:data.infos.filter( info => !selectedInfos.includes( info.key ) ) } );
            setResult( result.filter( item => !selectedInfos.includes( item.key ) ) );
        }
        else{
            throwNotification( {
                duration:4,
                type:'error',
                description: request.message || 'Silme İşlemi sırasında bir hata oluştu',
                message:'Hata'
            } );
        }
    }

    return (
        <div style={{ width:750, height:650 }}>
            <div style={{ width:750, height:60, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                <Select
                    mode='tags'
                    style={{ width: optionWidth }}
                    placeholder='Filtreler'
                    onChange={ handleChangeOption }
                    options={ options }
                    allowClear
                />
                <ButtonComponent disabled = { selectedInfos.count === 0 } type="primary" style= {{ backgroundColor:'red' }} onClick={ async () => { await deleteSelectedRows(); } }> Seçilileri Sil </ButtonComponent>
            </div>
            <Table 
                rowSelection = { rowSelection }
                scroll  = { { y:550 } }
                style   = { { width:750 } }
                columns = { [ 
                    {
                        title: 'Bilgi',
                        dataIndex: 'information',
                        align:'center',
                    },
                    {
                        title:'Kaynak',
                        key: 'informationSource',
                        align:'center',
                        render:( props ) => <a target="_blank" rel="noreferrer" href={'//'+props.informationSource}>{props.informationSource}</a>
                    },
                    {
                        title:'#',
                        key: 'key',
                        align:'center',
                        render : ( props ) => {
                            return <ButtonComponent onClick = { async () => {
                                const request = await deleteInfoAPI( '/information/delete/'+props.key );
                                if ( request.status && request.status === true ) {
                                    throwNotification( {
                                        duration:2,
                                        type:'success',
                                        description: request.message,
                                        message:'Başarılı'
                                    } );
                                    setData( { ...data, infos:data.infos.filter( info => info.key !== props.key ) } );
                                    setResult( result.filter( item => item.key !== props.key ) );
                                }
                                else{
                                    throwNotification( {
                                        duration:4,
                                        type:'error',
                                        description: request.message || 'Silme İşlemi sırasında bir hata oluştu',
                                        message:'Hata'
                                    } );
                                }

                            } }> Sil </ButtonComponent>
                        }
                    }
                ] }
                dataSource = { result }
                pagination = {{ defaultPageSize:50 }}
            />
        </div>
    );
}
export default InfosTableComponent;