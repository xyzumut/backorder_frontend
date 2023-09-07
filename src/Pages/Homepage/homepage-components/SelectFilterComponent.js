import React from 'react';
import { Select } from 'antd';
import { useHomePage } from '../../../context/homepage-context';

const SelectFilterComponent = () => {

    const { query, setQuery,} = useHomePage(); 

    const [ width, setWidth ] = React.useState( 400 )
    const options = [
        { value:'1', label:'Onay Bekleyenler' },
        { value:'2', label:'Mail Bekleyenler' },
        { value:'4', label:'Kuyruktakiler' },
        { value:'8', label:'Tamamlananlar' },
    ];

    const handleChange = ( value ) => {
        if ( value.length > 3 ) {
            setWidth( 600 );
        }
        else if( value.length > 2 ){
            setWidth( 550 );
        }
        else{
            setWidth( 400 );
        }
        let filterValue = 0;
        value.forEach( val => {
            filterValue = filterValue + Number( val );
        });
        setQuery( { ...query, filter:filterValue, page:1 } );
    }

    return <Select
        mode='tags'
        style={{
            width: width,
        }}
        placeholder='Filtreler'
        onChange={ handleChange }
        options={ options }
        allowClear
    />
};
export default SelectFilterComponent;