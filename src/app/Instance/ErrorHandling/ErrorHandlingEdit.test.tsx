import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import {
  ErrorHandlingEdit,
  ErrorHandlingEditProps,
} from "@app/Instance/ErrorHandling/ErrorHandlingEdit";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";

describe("ErrorHandlingEdit component", () => {
  const createComponent = (
    props: Partial<ErrorHandlingEditProps>
  ): RenderResult => {
    return customRender(
      <ErrorHandlingEdit
        getSchema={(): Promise<object> => new Promise(jest.fn())}
        isLoading={false}
        onCancelEditing={jest.fn}
        onSubmit={jest.fn}
        registerValidateParameters={jest.fn}
        {...props}
      />
    );
  };

  it("should display a form alert, when API error is present", async () => {
    const apiError = "API error";

    const comp = createComponent({ apiError });
    await waitForI18n(comp);

    const formAlert = comp.baseElement.querySelector(
      ".error-handling-edit__alert"
    );
    expect(formAlert).not.toBeNull();
    expect(formAlert).toBeInTheDocument();
    expect(formAlert).toHaveTextContent(apiError);
  });

  it("should call getSchemaByMethod callback, when a method is selected", async () => {
    const getSchema = jest.fn((method: string): Promise<object> => {
      return new Promise((resolve) => resolve({ method }));
    });

    const comp = createComponent({
      getSchema,
    });
    await waitForI18n(comp);

    await act(async () => {
      const selector = comp.baseElement.querySelector(
        "[data-ouia-component-id='error-handling-method-selector']"
      );
      fireEvent.click(
        selector?.querySelector(".pf-c-select__toggle-arrow") as Node
      );
      await waitFor(() => comp.getByText("Kafka topic"));
      fireEvent.click(comp.getByText("Kafka topic"));
    });

    expect(getSchema).toHaveBeenCalledTimes(1);
    expect(getSchema).toHaveBeenCalledWith("kafka_topic_sink_0.1", "action");
  });

  it("should call onCancelEdit callback, when cancel button is pressed", async () => {
    const onCancelEditing = jest.fn();

    const comp = createComponent({
      onCancelEditing,
    });
    await waitForI18n(comp);

    fireEvent.click(
      comp.baseElement.querySelector(
        "[data-ouia-component-id='cancel']"
      ) as Node
    );

    expect(onCancelEditing).toHaveBeenCalledTimes(1);
  });

  it("should call onSubmit callback, when save button is pressed", async () => {
    const onSubmit = jest.fn();

    const comp = createComponent({
      onSubmit,
    });
    await waitForI18n(comp);

    fireEvent.click(
      comp.baseElement.querySelector(
        "[data-ouia-component-id='submit']"
      ) as Node
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should display a configuration form for populating EH strategy, when a schema is passed", async () => {
    const comp = createComponent({
      getSchema: () =>
        Promise.resolve({
          type: "object",
          additionalProperties: false,
          properties: {},
        }),
      method: ERROR_HANDLING_METHODS.deadLetterQueue[0].value,
    });

    await waitForI18n(comp);

    expect(
      comp.baseElement.querySelector("[data-ouia-component-id='configuration']")
    ).toBeInTheDocument();
  });
});
