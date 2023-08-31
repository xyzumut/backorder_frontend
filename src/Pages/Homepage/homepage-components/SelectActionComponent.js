import { Select, Button } from "antd";
import React from "react";

const SelectActionComponent = ( { selectActionState, setSelectActionState, query, setQuery, initialQuery, loading, action } ) => {

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
        <div style={{ width:260, display:'flex', justifyContent:'space-around', 'alignItems':'center', height:60 }}>
            <Button disabled = { loading } type="primary" style={{ width:80 }} onClick={ () => { action(); } } >Gönder</Button>
            <Select disabled = { loading } style={{ width: 170 }} options={ options } allowClear onChange = { handleChange } value={ selectActionState } />
        </div>
    );
}

export default SelectActionComponent;