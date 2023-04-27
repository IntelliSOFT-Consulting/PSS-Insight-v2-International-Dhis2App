import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DataQuery } from '@dhis2/app-runtime';
import Main from '../components/Main';
import Loader from '../components/Loader';
import templateRoutes from '../routes/templateRoutes';
import indicatorRoutes from '../routes/indicatorRoutes';
import notificationRoutes from '../routes/notificationRoutes';

export default function Layout({ layout, user }) {
  const query = {
    me: {
      resource: 'me',
    },
  };

  const templateLinks = [
    {
      label: 'Versions',
      path: '/templates/versions',
    },
    {
      label: 'Add a New Version',
      path: '/templates/versions/new',
    },
  ];

  const indicatorLinks = [
    {
      label: 'Indicator Dictionary',
      path: '/indicators/dictionary',
    },
  ];

  const notificationLinks = [
    {
      label: 'Notification Subscriptions',
      path: '/notifications/subscriptions',
    },
    {
      label: 'Notifications Broadcast',
      path: '/notifications/create',
    },
  ];

  const routes = {
    Templates: {
      routes: templateRoutes,
      links: templateLinks,
      title: 'Master Indicator Templates',
    },
    Indicators: {
      routes: indicatorRoutes,
      links: indicatorLinks,
      title: 'Indicator Dictionary',
    },
    Notifications: {
      routes: notificationRoutes,
      links: notificationLinks,
      title: 'Notifications Menu',
    },
  };

  return (
    <DataQuery query={query}>
      {({ error, loading, data }) => {
        if (error) return <span>ERROR</span>;
        if (loading) return <Loader />;
        return (
          <Main
            sideLinks={routes[layout]?.links}
            title={routes[layout]?.title}
            showDashboard={true}
          >
            <Routes>
              {routes[layout]?.routes?.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.element user={data} />}
                />
              ))}
            </Routes>
          </Main>
        );
      }}
    </DataQuery>
  );
}
