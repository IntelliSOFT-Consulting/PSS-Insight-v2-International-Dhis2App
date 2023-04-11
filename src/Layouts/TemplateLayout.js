import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Menu, MenuItem } from '@dhis2/ui';
import classes from '../App.module.css';
import Versions from '../Pages/Versions';
import NewVersion from '../Pages/NewVersion';

export default function TemplateLayout({ user }) {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 48px)',
        height: '100%',
      }}
    >
      <aside className={classes.sidebar}>
        <Menu>
          <Link to='/' className={classes.sidebarHeader}>
            <MenuItem label='Dashboard' />
          </Link>

          <Link to='/'>
            <MenuItem label='Templates' />
          </Link>
          <Link to='/create'>
            <MenuItem label='Create a Template' />
          </Link>
        </Menu>
      </aside>
      <section
        style={{
          backgroundColor: '#F4F6F8',
          flexGrow: 1,
          padding: 20,
        }}
      >
        <Routes>
          <Route path='/' element={<Versions user={user} />} />
          <Route path='/create' element={<NewVersion user={user} />} />
          <Route path='/view/:id' element={<NewVersion user={user} />} />
          <Route path='/edit/:id' element={<NewVersion user={user} />} />
          <Route path='/*' element={<Versions user={user} />} />
        </Routes>
      </section>
    </main>
  );
}
