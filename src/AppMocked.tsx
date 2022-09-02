import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import { AppLayout } from "@app/components/AppLayout/AppLayout";
import Routes from "@app/Routes/Routes";
import {
  AppServicesLoading,
  I18nProvider,
} from "@rhoas/app-services-ui-components";
import { SmartEventsContextProvider } from "@contexts/SmartEventsContext";
import { SetupWorkerApi } from "msw";

// App using mocked apis trough msw

const AppMocked = (): JSX.Element => {
  // starting mock service worker
  // eslint-disable-next-line @typescript-eslint/no-var-requires,jest/no-mocks-import
  const { worker } = require("./../mocked-api/browser") as {
    worker: SetupWorkerApi;
  };
  void worker.start();

  const apiBaseUrl = process.env.BASE_URL as string;
  // setting up dummy auth functions
  const getToken = (): Promise<string> => Promise.resolve("dummy");
  const getUsername = (): Promise<string> => Promise.resolve("username");

  return (
    <SmartEventsContextProvider
      getToken={getToken}
      getUsername={getUsername}
      apiBaseUrl={apiBaseUrl}
    >
      <I18nProvider
        lng="en"
        resources={{
          en: {
            common: () =>
              import(
                "@rhoas/app-services-ui-components/locales/en/common.json"
              ),
            openbridgeTempDictionary: () =>
              import("../locales/en/openbridge.json"),
          },
        }}
        debug={true}
      >
        <Suspense fallback={<AppServicesLoading />}>
          <BrowserRouter basename={"/"}>
            <AppLayout>
              <Routes />
            </AppLayout>
          </BrowserRouter>
        </Suspense>
      </I18nProvider>
    </SmartEventsContextProvider>
  );
};

export default AppMocked;
