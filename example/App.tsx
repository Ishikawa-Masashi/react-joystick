import React, { FunctionComponent } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  useParams,
  useHistory,
  useLocation,
} from 'react-router-dom';
import Album from './Album';

import { Home } from './components/Home';

// export const App: React.VFC = () => {
//   return (
//     <BrowserRouter>
//       <Home />
//     </BrowserRouter>
//   );
// };

export const App: React.VFC = () => {
  return <Album />;
};
