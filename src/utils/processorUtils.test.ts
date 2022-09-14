import {
  getSchemaDefinition,
  prepareConfigParameters,
  prepareFilters,
  prepareRequest,
  resolveReference,
} from "@utils/processorUtils";
import { JSONSchema7 } from "json-schema";
import { ProcessorType } from "@rhoas/smart-events-management-sdk";
import omit from "lodash.omit";
import { FilterType } from "../types/Processor";

describe("prepareConfigParameters", () => {
  it("converts secret parameters values to empty strings in order to use them inside the processor form", () => {
    const configParameters = {
      slack_channel: "#test",
      slack_token: {},
    };

    const convertedParameters = prepareConfigParameters(
      configParameters,
      demoSchema,
      "read"
    );

    expect(convertedParameters).toStrictEqual({
      // non-secret fields values are untouched
      ...configParameters,
      // slack token converted to empty string because
      // of its "password" definition inside the schema
      slack_token: "",
    });
  });

  it("converts secret parameters from empty strings to empty objects (secret format)", () => {
    const configParameters = {
      slack_channel: "#test",
      slack_token: "",
    };

    const convertedParameters = prepareConfigParameters(
      configParameters,
      demoSchema,
      "write"
    );

    expect(convertedParameters).toStrictEqual({
      ...configParameters,
      // slack token has not been set, so it will be converted back into
      // an empty object
      slack_token: {},
    });
  });

  it("doesn't alter secret values when they are not empty", () => {
    const configParameters = {
      slack_channel: "#test",
      slack_token: "test-value",
    };

    const convertedParameters = prepareConfigParameters(
      configParameters,
      demoSchema,
      "write"
    );
    // non-empty secret parameters are not converted to empty objects (editing existing processor scenario and
    // overwriting a secret field with a new value)
    expect(convertedParameters).toStrictEqual(configParameters);
  });

  it("converts empty strings to empty objects only if the parameter is defined as secret within the schema", () => {
    const configParameters = {
      slack_channel: "#test",
      slack_token: "",
    };

    const convertedParameters = prepareConfigParameters(
      configParameters,
      demoSchemaNoPassword,
      "write"
    );

    // no changes from the input parameters. slack_token is not converted to an empty object because
    // it's not defined with a password format in the schema
    expect(convertedParameters).toStrictEqual(configParameters);
  });
});

describe("getSchemaDefinition", () => {
  it("retrieves a property definition from a json-schema", () => {
    const definition = getSchemaDefinition("slack_token", demoSchema);
    expect(definition).toStrictEqual(demoSchema?.properties?.slack_token);
  });

  it("retrieves the definition of a property described in a sub-schema", () => {
    const definition = getSchemaDefinition(
      "data_shape.consumes.format",
      schemaWithDef as JSONSchema7
    );
    expect(definition).toStrictEqual(
      schemaWithDef.$defs.data_shape.consumes.properties.format
    );
  });

  it("returns 'undefined' for not found properties", () => {
    const definition = getSchemaDefinition(
      "not_existing",
      schemaWithDef as JSONSchema7
    );
    expect(definition).toBeUndefined();
  });
});

describe("resolveReference", () => {
  it("retrieves a sub-schema reference defined inside the same json-schema file", () => {
    const def = resolveReference(
      "#/$defs/data_shape/consumes",
      schemaWithDef as JSONSchema7
    );
    expect(def).toBe(schemaWithDef.$defs.data_shape.consumes);
  });

  it("returns undefined if the reference is not found", () => {
    const def = resolveReference(
      "#/$defs/not_existing/consumes",
      schemaWithDef as JSONSchema7
    );
    expect(def).toBeUndefined();
  });
});

describe("prepareFilters", () => {
  it("keeps a filter when all the properties are present", () => {
    const basicFilter = {
      key: "name",
      type: FilterType.STRING_EQUALS,
      value: "test",
    };

    const result = prepareFilters([basicFilter]);
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual([basicFilter]);
  });

  it("skips filters with missing properties", () => {
    const result1 = prepareFilters([{ key: "name" }]);
    expect(result1).toHaveLength(0);

    const result2 = prepareFilters([{ type: FilterType.NUMBER_IN }]);
    expect(result2).toHaveLength(0);

    const result3 = prepareFilters([{ value: "one, two" }]);
    expect(result3).toHaveLength(0);

    const result4 = prepareFilters([
      {
        key: "name",
        type: FilterType.NUMBER_IN,
      },
    ]);
    expect(result4).toHaveLength(0);
  });

  it("converts a StringIn filter", () => {
    const validFilter = {
      key: "name",
      type: FilterType.STRING_IN,
      value: "one, two, three",
    };

    const result = prepareFilters([validFilter]);
    const { key, type } = validFilter;
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual([
      {
        key,
        type,
        values: validFilter.value.split(",").map((item) => item.trim()),
      },
    ]);
  });

  it("converts NumberIn filters when the values are valid", () => {
    const validFilter = {
      key: "name",
      type: FilterType.NUMBER_IN,
      value: "1, 2, 3",
    };

    const result = prepareFilters([validFilter]);
    const { key, type } = validFilter;
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual([
      {
        key,
        type,
        values: validFilter.value
          .split(",")
          .map((item) => parseFloat(item.trim())),
      },
    ]);
  });

  it("skips NumberIn filters when the values are not numbers", () => {
    const validFilter = {
      key: "name",
      type: FilterType.NUMBER_IN,
      value: "one, two, three",
    };

    const result = prepareFilters([validFilter]);

    expect(result).toHaveLength(0);
  });
});

describe("prepareRequest", () => {
  it("correctly includes only relevant properties for a sink processor", () => {
    const processorData = {
      ...baseProcessorFormData,
      type: ProcessorType.Sink,
      action: {
        type: "slack",
        parameters: {
          slack_token: "token",
          slack_channel: "#test",
        },
      },
    };

    const result = prepareRequest(processorData, false, demoSchema);
    // properties not included are empty ones ("filters", "transformation"), not valid for the
    // current type ("source" within sink processor in this case) and not requested ones ("type")
    expect(result).toStrictEqual(
      omit(processorData, [
        "source",
        "filters",
        "transformationTemplate",
        "type",
      ])
    );
  });

  it("correctly includes only relevant properties for a source processor", () => {
    const processorData = {
      ...baseProcessorFormData,
      type: ProcessorType.Source,
      source: {
        type: "slack",
        parameters: {
          slack_token: "token",
          slack_channel: "#test",
        },
      },
    };

    const result = prepareRequest(processorData, false, demoSchema);
    // "action" property is skipped, "source" is kept
    expect(result).toStrictEqual(
      omit(processorData, [
        "action",
        "filters",
        "transformationTemplate",
        "type",
      ])
    );
  });

  it("correctly includes optional properties only when they contain values", () => {
    const processorData = {
      ...baseProcessorFormData,
      type: ProcessorType.Source,
      source: {
        type: "slack",
        parameters: {
          slack_token: "token",
          slack_channel: "#test",
        },
      },
      filters: [{ key: "name", type: FilterType.STRING_EQUALS, value: "test" }],
      transformationTemplate: "hello",
    };

    const result = prepareRequest(processorData, false, demoSchema);
    // transformation template and filters are kept
    expect(result).toStrictEqual(omit(processorData, ["action", "type"]));
  });

  it("takes care of converting empty secret parameters when editing an existing processor", () => {
    const processorData = {
      ...baseProcessorFormData,
      type: ProcessorType.Source,
      source: {
        type: "slack",
        parameters: {
          slack_token: "",
          slack_channel: "#test",
        },
      },
    };

    const result = prepareRequest(processorData, true, demoSchema);
    const expectedRequestData = {
      ...omit(processorData, [
        "action",
        "type",
        "filters",
        "transformationTemplate",
      ]),
      source: {
        ...processorData.source,
        // the empty "slack_token" is converted back to an empty object
        parameters: { ...processorData.source.parameters, slack_token: {} },
      },
    };
    expect(result).toStrictEqual(expectedRequestData);
  });
});

const demoSchema: JSONSchema7 = {
  type: "object",
  additionalProperties: false,
  required: ["slack_channel", "slack_token"],
  properties: {
    slack_channel: {
      title: "Channel",
      description: "The Slack channel to receive messages from",
      type: "string",
    },
    slack_token: {
      title: "Token",
      oneOf: [
        {
          title: "Token",
          description:
            "The token to access Slack. A Slack app is needed. This app needs to have channels:history and channels:read permissions. The Bot User OAuth Access Token is the kind of token needed.",
          type: "string",
          format: "password",
        },
        {
          description: "An opaque reference to the slack_token",
          type: "object",
          properties: {},
        },
      ],
    },
  },
};

const demoSchemaNoPassword = {
  ...demoSchema,
  properties: {
    ...demoSchema.properties,
    slack_token: {
      title: "Token",
      description: "The token to access Slack.",
      type: "string",
    },
  },
};

const schemaWithDef = {
  type: "object",
  additionalProperties: false,
  required: ["slack_channel", "slack_webhook_url"],
  properties: {
    slack_channel: {
      title: "Channel",
      description: "The Slack channel to send messages to.",
      type: "string",
      example: "#myroom",
    },
    slack_webhook_url: {
      title: "Webhook URL",
      "x-group": "credentials",
      oneOf: [
        {
          title: "Webhook URL",
          description:
            "The webhook URL used by the Slack channel to handle incoming messages.",
          type: "string",
          format: "password",
        },
        {
          description: "An opaque reference to the slack_webhook_url",
          type: "object",
          properties: {},
        },
      ],
    },
    data_shape: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumes: {
          $ref: "#/$defs/data_shape/consumes",
        },
      },
    },
    processors: {},
  },
  $defs: {
    data_shape: {
      consumes: {
        type: "object",
        additionalProperties: false,
        required: ["format"],
        properties: {
          format: {
            type: "string",
            default: "application/octet-stream",
            enum: ["application/octet-stream"],
          },
        },
      },
    },
  },
};

const baseProcessorFormData = {
  name: "test",
  filters: [{ key: "", type: "", value: "" }],
  transformationTemplate: "",
  action: {
    type: "",
    parameters: {},
  },
  source: {
    type: "",
    parameters: {},
  },
};
