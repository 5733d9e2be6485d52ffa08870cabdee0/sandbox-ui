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
import { KeycloakAuthProvider, setKeycloakInstance } from "./Keycloak";
import { Config, ConfigContext } from "@rhoas/app-services-ui-shared";

const App = (): JSX.Element => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await setKeycloakInstance();
      setInitialized(true);
    };
    void init();
  }, []);

  const config = {
    smart_events: {
      apiBasePath: process.env.BASE_URL as string,
    },
  } as Config;

  return (
    <KeycloakAuthProvider>
      <ConfigContext.Provider value={config}>
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
              {initialized && (
                <AppLayout>
                  <Routes />
                </AppLayout>
              )}
            </BrowserRouter>
          </Suspense>
        </I18nProvider>
      </ConfigContext.Provider>
    </KeycloakAuthProvider>
  );
};

export default App;
