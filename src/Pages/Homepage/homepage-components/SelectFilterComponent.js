import React from 'react';
import { Select } from 'antd';

const SelectFilterComponent = ( { optionFilter, setOptionFilter, loading } ) => {

    const [ width, setWidth ] = React.useState( 400 )
    const options = [
        { value:'1', label:'Onaylananları Getir' },
        { value:'2', label:'Onay Bekleyenleri Getir' },
        { value:'4', label:'Kuyruktakileri Getir' },
        { value:'8', label:'Kontrol edilenleri getir' },
    ];

    const handleChange = ( value ) => {
        if ( value.length === 4 ) {
            setWidth( 700 );
        }
        else if( value.length === 3 ){
            setWidth( 550 );
        }
        else{
            setWidth( 400 );
        }
        setOptionFilter( value );
    }

    return <Select
        mode='tags'
        style={{
            width: width,
        }}
        placeholder='Filtreler'
        onChange={ handleChange }
        options={ options }
        loading = { loading }
    />
};
export default SelectFilterComponent;