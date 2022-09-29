import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import { ErrorHandlingCreate } from "@app/Instance/ErrorHandling/ErrorHandlingCreate";

describe("ErrorHandlingCreate component", () => {
  it("should display a dropbox for selecting the error method", async () => {
    const comp = customRender(
      <ErrorHandlingCreate
        errorHandlingSchemaLoading={false}
        formIsDisabled={false}
        onErrorHandlingMethodSelection={jest.fn}
        onErrorHandlingParametersChange={jest.fn}
        registerValidateParameters={jest.fn}
      />
    );

    await waitForI18n(comp);

    expect(
      comp.baseElement.querySelector(
        "[data-ouia-component-id='error-handling-method-selector']"
      )
    ).toBeInTheDocument();
  });

  it("should display a configuration form for populating EH strategy, when a schema is passed", async () => {
    const comp = customRender(
      <ErrorHandlingCreate
        errorHandlingSchemaLoading={false}
        formIsDisabled={false}
        onErrorHandlingMethodSelection={jest.fn}
        onErrorHandlingParametersChange={jest.fn}
        registerValidateParameters={jest.fn}
        errorHandlingSchema={{
          type: "object",
          additionalProperties: false,
          properties: {},
        }}
      />
    );

    await waitForI18n(comp);

    expect(
      comp.baseElement.querySelector("[data-ouia-component-id='configuration']")
    ).toBeInTheDocument();
  });
});
