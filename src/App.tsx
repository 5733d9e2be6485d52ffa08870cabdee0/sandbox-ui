import React from 'react';
import '@patternfly/patternfly/patternfly.css';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from '@app/components/AppLayout/AppLayout';
import OBRoutes from '@app/OBRoutes/OBRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <OBRoutes />
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
