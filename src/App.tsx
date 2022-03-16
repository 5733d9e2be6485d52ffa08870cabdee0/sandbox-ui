import React from 'react';
import '@patternfly/patternfly/patternfly.css';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from '@app/components/AppLayout/AppLayout';
import Routes from '@app/Routes/Routes';

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes />
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
