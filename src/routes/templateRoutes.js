import NewVersion from '../Pages/NewVersion';
import Versions from '../Pages/Versions';

const routes = [
  {
    path: '/templates/versions',
    element: Versions,
  },
  {
    path: '/templates/versions/new',
    element: NewVersion,
  },
  {
    path: '/templates/versions/view/:id',
    element: NewVersion,
  },
  {
    path: '/templates/versions/edit/:id',
    element: NewVersion,
  },
];

export default routes;
