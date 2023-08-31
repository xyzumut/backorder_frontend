import React from 'react';
import debounce from "lodash.debounce"; // Doğru import edildiğinden emin olun
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { useHomePage } from '../../../context/homepage-context';

const SearchComponent = ( { width, loading, style } ) => {

    const { query, setQuery } = useHomePage()


    const debouncedHandleChange = React.useMemo(() => {
        return debounce((value) => {
            setQuery( { ...query, search: value, page:1 } );
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