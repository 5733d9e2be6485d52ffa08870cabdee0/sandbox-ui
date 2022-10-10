import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import ErrorHandlingCreate from "@app/Instance/ErrorHandling/ErrorHandlingCreate";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";

describe("ErrorHandlingCreate component", () => {
  it("should display a dropbox for selecting the error method", async () => {
    const comp = customRender(
      <ErrorHandlingCreate
        isDisabled={false}
        getSchema={(): Promise<object> => Promise.resolve(jest.fn)}
        onChange={jest.fn}
        registerValidation={jest.fn}
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
        isDisabled={false}
        getSchema={(): Promise<object> =>
          Promise.resolve({
            type: "object",
            additionalProperties: false,
            properties: {},
          })
        }
        onChange={jest.fn}
        registerValidation={jest.fn}
        schemaId={ERROR_HANDLING_METHODS.deadLetterQueue[0].value}
      />
    );

    await waitForI18n(comp);

    expect(
      comp.baseElement.querySelector("[data-ouia-component-id='configuration']")
    ).toBeInTheDocument();
  });
});
