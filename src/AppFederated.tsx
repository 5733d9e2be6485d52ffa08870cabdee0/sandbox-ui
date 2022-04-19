import React, { Suspense } from "react";
import { useBasename } from "@rhoas/app-services-ui-shared";
import {
  AppServicesLoading,
  I18nProvider,
} from "@rhoas/app-services-ui-components";
import { BrowserRouter } from "react-router-dom";
import Routes from "@app/Routes/Routes";

const AppFederated = (): JSX.Element => {
  const basename = useBasename();
  /* The i18n provider is necessary to consume the open bridge dictionary
        during initial local development. When the first OB UI release will be ready, the
        OB dictionary will be moved to app-services-ui-components, where
        all dictionaries reside. See https://issues.redhat.com/browse/MGDOBR-408
        for more details. */
  return (
    <>
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
          <BrowserRouter basename={basename?.getBasename()}>
            <Routes />
          </BrowserRouter>
        </Suspense>
      </I18nProvider>
    </>
  );
};

export default AppFederated;
