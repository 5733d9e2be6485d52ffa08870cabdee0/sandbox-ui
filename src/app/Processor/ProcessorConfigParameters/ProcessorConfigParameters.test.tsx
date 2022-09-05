import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import ProcessorConfigParameters, {
  maskedValue,
} from "@app/Processor/ProcessorConfigParameters/ProcessorConfigParameters";
import { JSONSchema7 } from "json-schema";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";

describe("ProcessorConfigParameters", () => {
  it("should display properties and their values", async () => {
    const comp = customRender(
      <ProcessorConfigParameters
        schema={testSchema as JSONSchema7}
        parameters={{
          user: "testUser",
          password: {},
          flag1: true,
          flag2: false,
          numeric: 3.14,
          integer: 10,
          data_shape: { produces: { format: "application/json" } },
        }}
      />
    );
    await waitForI18n(comp);

    // string value
    testProperty(comp, "user", "Username", "testUser");
    // masked value
    testProperty(comp, "password", "Password", maskedValue);
    // boolean value set to true
    testProperty(comp, "flag1", "Flag 1", "Yes");
    // boolean value set to false
    testProperty(comp, "flag2", "Flag 2", "No");
    // numeric value
    testProperty(comp, "numeric", "Number", "3.14");
    // integer value
    testProperty(comp, "integer", "Integer number", "10");
    // data shape specific value
    testProperty(comp, "data_shape", "data shape", "application/json");

    // description tooltip
    expect(
      comp.queryByText(testSchema.properties.user.description)
    ).not.toBeInTheDocument();

    fireEvent.click(comp.getByText("Username"));

    await waitFor(() => {
      expect(
        comp.queryByText(testSchema.properties.user.description)
      ).toBeInTheDocument();
    });
  });

  it("should display a message for properties not configured", async () => {
    const comp = customRender(
      <ProcessorConfigParameters
        schema={testSchema as JSONSchema7}
        parameters={{
          user: "testUser",
          data_shape: { produces: { format: "application/json" } },
        }}
      />
    );
    await waitForI18n(comp);

    testProperty(comp, "user", "Username", "testUser");
    testProperty(comp, "password", "Password", propertyNotConfigured);
    testProperty(comp, "flag1", "Flag 1", propertyNotConfigured);
    testProperty(comp, "flag2", "Flag 2", propertyNotConfigured);
    testProperty(comp, "numeric", "Number", propertyNotConfigured);
    testProperty(comp, "integer", "Integer number", propertyNotConfigured);
    testProperty(comp, "data_shape", "data shape", "application/json");
  });
});

const testProperty = (
  comp: RenderResult,
  key: string,
  title: string,
  value: string
): void => {
  expect(comp.getByTestId(key)).toHaveTextContent(title);
  expect(comp.getByTestId(`${key}-value`)).toHaveTextContent(value);
};

const propertyNotConfigured = "Property not configured";

const testSchema = {
  type: "object",
  additionalProperties: false,
  required: ["user"],
  properties: {
    user: {
      title: "Username",
      type: "string",
      description: "The username you want to use.",
    },
    password: {
      title: "Password",
      "x-group": "credentials",
      oneOf: [
        {
          title: "Password",
          type: "string",
          format: "password",
        },
        {
          type: "object",
          properties: {},
        },
      ],
    },
    flag1: {
      title: "Flag 1",
      type: "boolean",
    },
    flag2: {
      title: "Flag 2",
      type: "boolean",
    },
    numeric: {
      title: "Number",
      type: "number",
    },
    integer: {
      title: "Integer number",
      type: "integer",
    },
    data_shape: {
      type: "object",
      additionalProperties: false,
      properties: {
        produces: {
          $ref: "#/$defs/data_shape/produces",
        },
      },
    },
  },
  $defs: {
    data_shape: {
      produces: {
        type: "object",
        additionalProperties: false,
        required: ["format"],
        properties: {
          format: {
            type: "string",
            default: "application/json",
            enum: ["application/json"],
          },
        },
      },
    },
  },
};
