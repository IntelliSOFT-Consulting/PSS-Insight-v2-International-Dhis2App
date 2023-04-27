import NewVersion from '../Pages/NewVersion';
import Versions from '../Pages/Versions';

const routes = [
  {
    path: '/versions',
    element: Versions,
  },
  {
    path: '/versions/new',
    element: NewVersion,
  },
  {
    path: '/versions/view/:id',
    element: NewVersion,
  },
  {
    path: '/versions/edit/:id',
    element: NewVersion,
  },
];

export default routes;
