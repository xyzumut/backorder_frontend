import React from 'react';
import { Layout, Menu } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Homepage, DataPage, MailPage, NetSearchPage } from './Pages/pages';
import { HomeOutlined, MailOutlined, SearchOutlined } from '@ant-design/icons';
import { HomepageContextProvider } from './context/homepage-context';

const App = () => {
  const navigate = useNavigate();
  const { Content, Sider } = Layout;
  const [ pageIndex, setPageIndex ] = React.useState( 1 )

  const pages = [
    { name:'anasayfa', viewName:'Ana Sayfa'         , icon:HomeOutlined  , key:1 },
    { name:'mail'    , viewName:'Mail Ayarları'     , icon:MailOutlined  , key:2 },
    { name:'internet', viewName:'İnternet Ayarları' , icon:SearchOutlined, key:3 },
  ]

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider theme='dark'>
        <h3 style={{ width:'100%', height:40, textAlign:'left', color:'rgba(255, 255, 255, 0.65)', paddingLeft:30, margin:'20px 0 0 0' }}> Sekmeler </h3>
        <Menu
          theme='dark'
          mode="inline"
          defaultSelectedKeys={ [ (pageIndex).toString() ] }
          items={ pages.map(
            ( page ) => ({
              key     : page.key,
              label   : page.viewName,
              icon    : React.createElement( page.icon ),
              onClick : () => {
                setPageIndex( page.key );
                navigate( '/'+page.name );
              },
            })
          )}
        />
      </Sider>
      <Layout>
        <Content>
          <Routes>
            <Route path="/"           element={ <HomepageContextProvider><Homepage/></HomepageContextProvider> }      />
            <Route path="/anasayfa"   element={ <HomepageContextProvider><Homepage/></HomepageContextProvider> }      />
            <Route path="/mail"       element={<MailPage/>}      />
            <Route path="/kayit"      element={<DataPage/>}      />
            <Route path="/internet"   element={<NetSearchPage/>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;