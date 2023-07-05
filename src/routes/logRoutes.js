import ChangeLogs from '../Pages/ChangeLogs';
import LogDetails from '../Pages/LogDetails';

const routes = [
  {
    path: '/changelogs',
    element: ChangeLogs,
  },
  {
    path: '/changelog/:version',
    element: LogDetails,
  },
];

export default routes;
