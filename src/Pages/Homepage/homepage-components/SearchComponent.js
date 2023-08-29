import React from 'react';
import debounce from "lodash.debounce"; // Doğru import edildiğinden emin olun
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';

const SearchComponent = ( { width, loading, style, query, setQuery, initialQuery } ) => {

    const debouncedHandleChange = React.useMemo(() => {
        return debounce((value) => {
            setQuery( { ...query, search: value } );
        }, 500);
    }, [setQuery, query]);

    React.useEffect(() => {
        return () => {
            debouncedHandleChange.cancel();
        };
    }, [debouncedHandleChange]);

    const handleInputChange = (e) => {
        debouncedHandleChange( e.target.value );
    };

    return (
        <Space.Compact style={ { width:width || 250, ...style } }>
            <Input onChange={ handleInputChange } placeholder="Domain ara" allowClear addonAfter={ <SearchOutlined/> } disabled={ loading }/>
        </Space.Compact>
    );
}

export default SearchComponent;