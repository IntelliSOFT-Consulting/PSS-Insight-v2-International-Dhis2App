import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { DataQuery } from '@dhis2/app-runtime';
import { Layout, Menu } from 'antd';
import Loader from '../components/Loader';
import templateRoutes from '../routes/templateRoutes';
import indicatorRoutes from '../routes/indicatorRoutes';
import notificationRoutes from '../routes/notificationRoutes';
import configRoutes from '../routes/configRoutes';
import logRoutes from '../routes/logRoutes';
import { createUseStyles } from 'react-jss';
import Home from '../Pages/Home';
import Error404 from '../Pages/Error404';

const { Content, Sider } = Layout;

const useStyles = createUseStyles({
  '@global': {
    '.ant-layout': {
      backgroundColor: '#f0f2f5',
      '& .ant-layout-sider': {
        backgroundColor: '#fff',
        position: 'fixed',
      },
    },
  },
  layout: {
    display: 'grid !important',
    gridTemplateColumns: '200px 1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: '"sidebar main"',
    minHeight: 'calc(100vh - 48px)',
    '& .ant-menu-item-selected': {
      backgroundColor: '#B9D2E0 !important',
      borderRadius: '0px !important',
      color: '#0266B9 !important',
    },
    '& .ant-menu-submenu-selected >.ant-menu-submenu-title': {
      color: '#0266B9 !important',
    },
    '& li': {
      '& :hover': {
        borderRadius: '0px !important',
      },
    },
  },
});

const createLink = (label, path) => <Link to={path}>{label}</Link>;

export default function MainLayout() {
  const classes = useStyles();
  const query = {
    me: {
      resource: 'me',
    },
  };

  const baseUrl = window.location.origin;
  const sideLinks = [
    {
      label: <a href={baseUrl}>Dashboard</a>,
      key: 'dashboard',
    },
    {
      label: 'Templates',
      key: 'templates',
      children: [
        {
          label: createLink('Versions', '/templates/versions'),
          key: 'versions',
        },
        {
          label: createLink('New Version', '/templates/versions/new'),
          key: 'newVersion',
        },
      ],
    },
    {
      label: 'Indicator Dictionary',
      key: 'indicators',
      children: [
        {
          label: createLink('Dictionary', '/indicators/dictionary'),
          key: 'dictionary',
        },
        {
          label: createLink('New Indicator', '/indicators/add'),
          key: 'newIndicator',
        },
      ],
    },
    {
      label: 'Notifications',
      key: 'notifications',
      children: [
        {
          label: createLink('Subscriptions', '/notifications/subscriptions'),
          key: 'subscriptions',
        },
        {
          label: createLink('Broadcast', '/notifications/create'),
          key: 'broadcast',
        },
      ],
    },
    {
      label: createLink('Change Logs', '/changelogs'),
      key: 'changelogs',
    },
    {
      label: createLink('Configurations', '/configurations'),
      key: 'configurations',
    },
  ];

  const routes = [
    ...templateRoutes,
    ...indicatorRoutes,
    ...notificationRoutes,
    ...configRoutes,
    ...logRoutes,
  ];

  return (
    <DataQuery query={query}>
      {({ error, loading, data }) => {
        if (error) return <span>ERROR</span>;
        if (loading) return <Loader />;
        return (
          <div className={classes.layout}>
            <Layout>
              <Sider
                width={200}
                style={{
                  minHeight: 'calc(100vh - 48px)',
                }}
              >
                <Menu
                  mode='inline'
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{
                    height: '100%',
                    borderRight: 0,
                  }}
                  items={sideLinks}
                />
              </Sider>
            </Layout>
            <Layout
              style={{
                padding: '0 24px 24px',
              }}
            >
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <Routes>
                  <Route path='/' element={<Home user={data} />} />
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={<route.element user={data} />}
                    />
                  ))}
                  <Route path='*' element={<Error404 />} />
                </Routes>
              </Content>
            </Layout>
          </div>
        );
      }}
    </DataQuery>
  );
}
