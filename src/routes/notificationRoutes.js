import NotificationBroadCast from '../Pages/NotificationBroadCast';
import NotificationSubscriptions from '../Pages/NotificationSubscriptions';
import Error404 from '../Pages/Error404';

const routes = [
  {
    path: '/create',
    element: NotificationBroadCast,
  },
  {
    path: '/subscriptions',
    element: NotificationSubscriptions,
  },
  {
    path: '*',
    element: Error404,
  },
];

export default routes;
