import React from 'react';
import { AppLayout } from '@app/components/AppLayout/AppLayout';
import { BrowserRouter } from 'react-router-dom';
import '@patternfly/patternfly/patternfly.css';
import OBOverviewPage from '@app/OBOverview/OBOverviewPage/OBOverviewPage';

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <OBOverviewPage />
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
