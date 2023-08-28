import { motion } from "framer-motion";
import React from "react";
import TableComponent from "./homepage-components/TableComponent";
import SearchComponent from "./homepage-components/SearchComponent";

const Homepage = () => {

    const initialdata = [
        { key:1,  domain: 'umut.com.tr',       dropdate: '2023-12-12', status:false },
        { key:2,  domain: 'example.com',       dropdate: '2023-08-25', status:true },
        { key:3,  domain: 'test.net',          dropdate: '2023-09-01', status:true },
        { key:4,  domain: 'stackoverflow.com', dropdate: '2023-11-18', status:false },
        { key:5,  domain: 'google.com',        dropdate: '2023-07-05', status:true },
        { key:6,  domain: 'github.com',        dropdate: '2023-10-10', status:true },
        { key:7,  domain: 'facebook.com',      dropdate: '2023-12-25', status:true },
        { key:8,  domain: 'twitter.com',       dropdate: '2023-09-15', status:false },
        { key:9,  domain: 'linkedin.com',      dropdate: '2024-01-30', status:true },
        { key:10, domain: 'amazon.com',        dropdate: '2023-11-10', status:true },
        { key:11, domain: 'apple.com',         dropdate: '2023-12-01', status:true },
        { key:12, domain: 'yahoo.com',         dropdate: '2023-11-30', status:true },
        { key:13, domain: 'bing.com',          dropdate: '2023-10-20', status:true },
        { key:14, domain: 'instagram.com',     dropdate: '2023-12-10', status:true },
        { key:15, domain: 'reddit.com',        dropdate: '2023-11-05', status:false },
        { key:16, domain: 'ebay.com',          dropdate: '2023-12-20', status:false },
        { key:17, domain: 'wikipedia.org',     dropdate: '2023-09-20', status:true },
        { key:18, domain: 'pinterest.com',     dropdate: '2023-10-15', status:false },
        { key:19, domain: 'tiktok.com',        dropdate: '2024-02-05', status:true },
        { key:20, domain: 'netflix.com',       dropdate: '2023-10-30', status:false }
    ];

    const [ data, setData ]             = React.useState( initialdata ); // genel datayı tuttuğum state
    const [ selected, setSelected ]     = React.useState( {} ); // seçilen satırları tuttuğum state
    const [ searchText, setSearchText ] = React.useState( '' ); // Domain ismi ile arama yaparken kullandığım state
    const [ loading, setLoading ]       = React.useState( false ); // verilerin gelip gelmediğinin loaderi

    return (
        <motion.div initial = {{ opacity:0, translateY:100 }} animate = {{ opacity:1, translateY:0 }} > 
            <div style={{ width:1000 }}>
                <SearchComponent width={ '100%' } searchState={ searchText } setSearchState={ setSearchText } loading={ loading } />
                <TableComponent selected={ selected } setSelected={ setSelected } data={ data } loading={ loading } />
            </div>
        </motion.div>
    );
}
export default Homepage;