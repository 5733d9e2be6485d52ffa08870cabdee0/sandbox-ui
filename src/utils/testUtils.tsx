import React, { FunctionComponent, Suspense, ReactElement } from "react";
import { I18nProvider } from "@rhoas/app-services-ui-components";
import {
  render,
  RenderOptions,
  RenderResult,
  waitFor,
} from "@testing-library/react";

const suspenseTestId = "i18n-suspense";

const Providers: FunctionComponent = ({ children }) => {
  return (
    <I18nProvider
      lng="en"
      resources={{
        en: {
          common: () =>
            import("@rhoas/app-services-ui-components/locales/en/common.json"),
          smartEventsTempDictionary: () =>
            import("../../locales/en/smart-events.json"),
        },
      }}
      debug={false}
    >
      <Suspense fallback={<div data-testid={suspenseTestId}>loading</div>}>
        {children}
      </Suspense>
    </I18nProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => render(ui, { wrapper: Providers, ...options });

async function waitForI18n(r: RenderResult): Promise<void> {
  await waitFor(() => {
    expect(r.queryByTestId(suspenseTestId)).not.toBeInTheDocument();
  });
}

export { customRender, Providers, waitForI18n };
