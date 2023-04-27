import IndicatorDetails from '../Pages/IndicatorDetails';
import Indicators from '../Pages/Indicators';
import NewIndicator from '../Pages/NewIndicator';

const routes = [
  {
    path: '/dictionary',
    element: Indicators,
  },
  {
    path: '/add',
    element: NewIndicator,
  },
  {
    path: '/indicator/:id/edit',
    element: NewIndicator,
  },
  {
    path: '/indicator/:id',
    element: IndicatorDetails,
  },
];

export default routes;
