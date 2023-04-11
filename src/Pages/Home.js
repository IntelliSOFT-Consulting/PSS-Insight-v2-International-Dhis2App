import React from 'react';
import { Card } from '@dhis2/ui';
import { Link } from 'react-router-dom';
import classes from '../App.module.css';
const routes = [
  {
    path: '/templates',
    text: 'Master Indicator Template',
  },
  {
    path: '/benchmarks',
    text: 'Benchmarks and Comparisons',
  },
];

export default function Main() {
  return (
    <Card className={classes.mainRoutes}>
      {routes.map(route => (
        <Link to={route.path} key={route.path}>
          {route.text}
        </Link>
      ))}
    </Card>
  );
}
