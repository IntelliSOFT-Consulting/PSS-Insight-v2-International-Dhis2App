import React from 'react';
import { DataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import './App.module.css';
import './custom.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import mainRoutes from './routes';
import Home from './Pages/Home';
import TemplateLayout from './Layouts/TemplateLayout';

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
              <Route path='/*' element={<TemplateLayout user={data} />} />
            </Routes>
          );
        }}
      </DataQuery>
    </div>
  </HashRouter>
);

export default MyApp;
