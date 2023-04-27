import React from 'react';
import { DataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import './App.module.css';
import './custom.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Layout from './Layouts/Layout';
import Error404 from './Pages/Error404';

const query = {
  me: {
    resource: 'me',
  },
};

const MyApp = () => (
  <HashRouter>
    <div>
      <DataQuery query={query}>
        {({ error, loading, data }) => {
          if (error) return <span>ERROR</span>;
          if (loading) return <span>...</span>;
          return (
            <Routes>
              <Route
                path='/templates/*'
                element={<Layout layout='Templates' user={data} />}
              />
              <Route
                path='/indicators/*'
                element={<Layout layout='Indicators' user={data} />}
              />
              <Route
                path='/notifications/*'
                element={<Layout layout='Notifications' user={data} />}
              />
              <Route path='/' element={<Home />} />
              <Route path='/*' element={<Error404 />} />
            </Routes>
          );
        }}
      </DataQuery>
    </div>
  </HashRouter>
);

export default MyApp;
