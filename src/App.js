import React from 'react';
import { DataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import './App.module.css';
import './custom.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layouts/Layout';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  '@global': {
    'svg.checked.disabled': {
      fill: '#D7D8D8 !important',
      '& .background': {
        fill: '#D7D8D8 !important',
      },
    },
  },
});

const query = {
  me: {
    resource: 'me',
  },
};

const MyApp = () => {
  const classes = useStyles();
  return (
    <HashRouter>
      <div className={classes.root}>
        <DataQuery query={query}>
          {({ error, loading, data }) => {
            if (error) return <span>ERROR</span>;
            if (loading) return <span>...</span>;
            return (
              <Routes>
                <Route path='/*' element={<Layout user={data} />} />
              </Routes>
            );
          }}
        </DataQuery>
      </div>
    </HashRouter>
  );
};

export default MyApp;
