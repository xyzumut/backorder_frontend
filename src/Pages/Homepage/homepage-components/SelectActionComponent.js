import { Select, Button } from "antd";
import React from "react";

const SelectActionComponent = ( { selectActionState, setSelectActionState, query, setQuery, initialQuery  } ) => {

    const options = [
        { value: 'sil'       , label: 'Sil' },
        { value: 'kontrol-et', label: 'Kontrol Sırasına Koy' },
        { value: 'mail-at'   , label: 'Mail Gönder' },
        { value: 'onayla'    , label: 'Onayla' },
    ]

    const handleChange = ( value ) => {
        setSelectActionState( value || '' );
    }

    return ( 
        <div style={{ width:300, display:'flex', justifyContent:'space-around', 'alignItems':'center', height:60 }}>
            <Select style={{ width: 200 }} options={ options } allowClear onChange = { handleChange } placeholder = 'Toplu İşlemler'/>
            <Button type="primary" style={{ width:80 }} onClick={ () => {  } } >Gönder</Button>
        </div>
    );
}

export default SelectActionComponent;