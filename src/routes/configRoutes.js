import Configurations from '../Pages/Configurations';
import EmailConfig from '../Pages/EmailConfig';

const routes = [
  {
    path: '/configurations',
    element: Configurations,
  },
  {
    path: '/configurations/email',
    element: EmailConfig,
  },
];

export default routes;
