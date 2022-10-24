import React, { Suspense, useEffect, useState } from "react";
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
import { getKeyCloakToken, getUsername, setKeycloakInstance } from "./Keycloak";
import { SmartEventsContextProvider } from "@contexts/SmartEventsContext";

const App = (): JSX.Element => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await setKeycloakInstance();
      setInitialized(true);
    };
    void init();
  }, []);

  const apiBaseUrl = process.env.BASE_URL as string;

  return (
    <I18nProvider
      lng="en"
      resources={{
        en: {
          common: () =>
            import("@rhoas/app-services-ui-components/locales/en/common.json"),
          smartEventsTempDictionary: () =>
            import("../locales/en/smart-events.json"),
        },
      }}
      debug={true}
    >
      <Suspense fallback={<AppServicesLoading />}>
        <BrowserRouter basename={"/"}>
          {initialized && (
            <SmartEventsContextProvider
              apiBaseUrl={apiBaseUrl}
              getToken={getKeyCloakToken}
              getUsername={getUsername}
            >
              <AppLayout>
                <Routes />
              </AppLayout>
            </SmartEventsContextProvider>
          )}
        </BrowserRouter>
      </Suspense>
    </I18nProvider>
  );
};

export default App;
