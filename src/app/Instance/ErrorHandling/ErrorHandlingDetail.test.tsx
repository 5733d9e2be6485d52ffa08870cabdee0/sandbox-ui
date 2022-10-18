import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import { RenderResult } from "@testing-library/react";
import {
  ErrorHandlingDetail,
  ErrorHandlingDetailProps,
} from "@app/Instance/ErrorHandling/ErrorHandlingDetail";

describe("ErrorHandlingDetail component", () => {
  const createComponent = (
    props: Partial<ErrorHandlingDetailProps>
  ): RenderResult => {
    return customRender(
      <ErrorHandlingDetail
        isBridgeLoading={false}
        isSchemaLoading={false}
        onEdit={jest.fn}
        isEditDisabled={false}
        {...props}
      />
    );
  };

  it("should display an alert, when API error is present", async () => {
    const apiError = "API error";

    const comp = createComponent({ apiError });
    await waitForI18n(comp);

    const formAlert = comp.baseElement.querySelector(
      ".instance-page__tabs-error-handling__alert"
    );
    expect(formAlert).not.toBeNull();
    expect(formAlert).toBeInTheDocument();
    expect(formAlert).toHaveTextContent(apiError);
  });

  it("should display a configuration section for EH strategy details, when a schema and parameters are passed", async () => {
    const param = "a param";
    const title = "Param";
    const comp = createComponent({
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          param: {
            type: "string",
            title,
          },
        },
      },
      errorHandlingParameters: { param },
    });
    await waitForI18n(comp);

    expect(comp.baseElement).toHaveTextContent(title);
    expect(comp.baseElement).toHaveTextContent(param);
  });

  it("should display a clipboard, with an endpoint, when EH strategy is ENDPOINT", async () => {
    const endpoint = "http://endpoint.com";
    const comp = createComponent({
      errorHandlingType: "endpoint",
      errorHandlingParameters: { endpoint },
    });
    await waitForI18n(comp);

    const errorHandlingEndpoint = comp.baseElement.querySelector(
      "[data-ouia-component-id='error-handling-endpoint']"
    );
    expect(errorHandlingEndpoint).toBeInTheDocument();
    expect(errorHandlingEndpoint).toHaveTextContent(endpoint);
  });
});
