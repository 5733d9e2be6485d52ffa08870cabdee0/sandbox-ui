import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@patternfly/patternfly/patternfly.css';
import { AppLayout } from '@app/components/AppLayout/AppLayout';
import Routes from '@app/Routes/Routes';
import {
  AppServicesLoading,
  I18nProvider,
} from '@rhoas/app-services-ui-components';

const App = () => {
  return (
    <I18nProvider
      lng="en"
      resources={{
        en: {
          common: () =>
            import('@rhoas/app-services-ui-components/locales/en/common.json'),
          openbridgeTempDictionary: () =>
            import('../locales/en/openbridge.json'),
        },
      }}
      debug={true}
    >
      <Suspense fallback={<AppServicesLoading />}>
        <BrowserRouter>
          <AppLayout>
            <Routes />
          </AppLayout>
        </BrowserRouter>
      </Suspense>
    </I18nProvider>
  );
};

export default App;
