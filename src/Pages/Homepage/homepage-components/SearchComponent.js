import React, { useMemo, useEffect } from 'react';
import debouce from "lodash.debounce";
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
// eslint-disable-next-line
const { Search } = Input;

const SearchComponent = ( { searchState, setSearchState, width, loading, style } ) => {


    const handleChange = (e) => {
        setSearchState(e.target.value);
    };
    
    const debouncedResults = useMemo(() => {
        return debouce( handleChange, 500 );
    }, [handleChange]);
    
    useEffect(() => {
        console.log( 'Değer : ', searchState );
        return () => {
          debouncedResults.cancel();
        };
    });

    return (
        <Space.Compact style={ { width:width || 250, ...style } }>
            {/* <Search onChange={debouncedResults} placeholder="Domain ara" allowClear/> */}
            <Input onChange={debouncedResults} placeholder="Domain ara" allowClear addonAfter={ <SearchOutlined/> } disabled={ loading }/>
        </Space.Compact>
    )
}

export default SearchComponent;