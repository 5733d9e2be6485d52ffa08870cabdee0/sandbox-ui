import React from "react";
import ProcessorEdit, { ProcessorEditProps } from "./ProcessorEdit";
import { customRender, waitForI18n } from "@utils/testUtils";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import {
  ManagedResourceStatus,
  ProcessorSchemaEntryResponse,
  ProcessorType,
} from "@rhoas/smart-events-management-sdk";
import { EventFilter } from "../../../types/Processor";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest
    .fn()
    .mockReturnValue({ environment: "dev", service: "fakeService" }),
}));

const setupProcessorEdit = (
  params: Partial<ProcessorEditProps>
): {
  comp: RenderResult;
  onSave: () => void;
  onCancel: () => void;
} => {
  const {
    saveButtonLabel = "Create",
    processor,
    malformedTransformationTemplate,
    getSchema = (): Promise<object> =>
      new Promise<object>((resolve) => {
        resolve({});
      }),
  } = params;
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const comp = customRender(
    <ProcessorEdit
      onSave={onSave}
      onCancel={onCancel}
      isLoading={false}
      saveButtonLabel={saveButtonLabel}
      processor={processor}
      malformedTransformationTemplate={malformedTransformationTemplate}
      schemaCatalog={schemaCatalog as ProcessorSchemaEntryResponse[]}
      getSchema={getSchema}
    />
  );
  return { comp, onSave, onCancel };
};

describe("ProcessorEdit component", () => {
  it("should display processor type selection first", async () => {
    const { comp } = setupProcessorEdit({});
    await waitForI18n(comp);

    await waitFor(() => {
      expect(comp.getByText("General information")).toBeInTheDocument();
    });

    expect(comp.queryByText("Source")).not.toBeInTheDocument();
    expect(comp.queryByText("Filters")).not.toBeInTheDocument();
    expect(comp.queryByText("Transformation")).not.toBeInTheDocument();
    expect(comp.queryByText("Action")).not.toBeInTheDocument();
  });

  it("should display specific form sections for source processors", async () => {
    const { comp } = setupProcessorEdit({});
    await waitForI18n(comp);

    await waitFor(() => {
      expect(comp.getByText("General information")).toBeInTheDocument();
    });

    fireEvent.click(comp.getByText("Source processor"));

    expect(comp.queryByText("Source")).toBeInTheDocument();
    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.queryByText("Transformation")).not.toBeInTheDocument();
    expect(comp.queryByText("Action")).not.toBeInTheDocument();
  });

  it("should display specific form sections for sink processors", async () => {
    const { comp } = setupProcessorEdit({});
    await waitForI18n(comp);

    await waitFor(() => {
      expect(comp.getByText("General information")).toBeInTheDocument();
    });

    fireEvent.click(comp.getByText("Sink processor"));

    expect(comp.queryByText("Source")).not.toBeInTheDocument();
    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.queryByText("Transformation")).toBeInTheDocument();
    expect(comp.queryByText("Action")).toBeInTheDocument();
  });

  it("should display custom save button", async () => {
    const saveButtonLabel = "Custom";
    const { comp } = setupProcessorEdit({ saveButtonLabel });
    await waitForI18n(comp);

    expect(comp.queryByText(saveButtonLabel)).toBeInTheDocument();
  });

  it("should display the information of the passed processor and the processor type section", async () => {
    const name = "Processor name";
    const type = "Sink";
    const kind = "Bridge";
    const id = "d7e13602-b046-4120-b377-15d61e21c31a";
    const href =
      "/api/smartevents_mgmt/v1/bridges/d7e13602-b046-4120-b377-15d61e21c31a";
    const submitted_at = "2022-02-01T12:02:00Z";
    const published_at = "2022-02-01T12:03:00Z";
    const owner = "bebianco@redhat.com";
    const status = "ready";
    const { comp } = setupProcessorEdit({
      saveButtonLabel: "Save",
      processor: {
        name,
        type: ProcessorType.Sink,
        kind: kind,
        id: id,
        href: href,
        submitted_at: submitted_at,
        published_at: published_at,
        owner: owner,
        status: status,
      },
    });
    await waitForI18n(comp);

    expect(comp.baseElement.querySelector("#processor-name")).toHaveValue(name);
    expect(comp.getByTestId("processor-type-label")).toHaveTextContent(type);
  });

  it("handles filters addition and removal", async () => {
    const { comp } = setupProcessorEdit({});
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Sink processor"));

    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.getAllByTestId("filter-item").length).toBe(1);
    expect(comp.getAllByLabelText("Delete filter").length).toBe(1);
    expect(comp.getByLabelText("Delete filter")).toBeDisabled();

    fireEvent.change(comp.getByLabelText("Key"), {
      target: { value: "name" },
    });
    expect(comp.getByDisplayValue("name")).toBeInTheDocument();

    fireEvent.click(comp.getByText("Add filter"));
    expect(comp.getAllByTestId("filter-item").length).toBe(2);
    expect(comp.getAllByLabelText("Delete filter")[0]).toBeEnabled();
    expect(comp.getAllByLabelText("Delete filter")[1]).toBeEnabled();

    fireEvent.change(comp.getAllByLabelText("Key")[1], {
      target: { value: "age" },
    });
    expect(comp.getByDisplayValue("age")).toBeInTheDocument();

    fireEvent.click(comp.getAllByLabelText("Delete filter")[1]);
    expect(comp.getAllByTestId("filter-item").length).toBe(1);
    expect(comp.queryByDisplayValue("age")).not.toBeInTheDocument();
    expect(comp.getByLabelText("Delete filter")).toBeDisabled();
  });

  it("handles filters with multiple values", async () => {
    const { comp, onSave } = setupProcessorEdit({
      processor: sinkProcessor,
      saveButtonLabel: "Save",
    });
    await waitForI18n(comp);

    const demoStringFilter = {
      key: "name",
      type: "StringIn",
      values: ["one", "two", "three"],
    };
    const demoNumberFilter = {
      key: "name",
      type: "NumberIn",
      values: [2, 4, 8],
    };

    const demoNotValidFilter = {
      key: "name",
      type: "NumberIn",
      values: ["one", "two", "three"],
    };

    const demoEmptyValuesFilter = {
      key: "name",
      type: "StringIn",
      values: [],
    };

    const fillUpFilterValues = (
      filter: Omit<EventFilter, "value">,
      index: number
    ): void => {
      fireEvent.change(comp.getAllByLabelText("Key")[index], {
        target: { value: filter.key },
      });
      fireEvent.change(comp.getAllByLabelText("Type")[index], {
        target: { value: filter.type },
      });
      fireEvent.change(comp.getAllByLabelText("Value")[index], {
        target: { value: filter.values?.join(", ") },
      });
    };

    const addFilter = (): void => {
      fireEvent.click(comp.getByText("Add filter"));
    };

    fillUpFilterValues(demoStringFilter, 0);
    addFilter();
    fillUpFilterValues(demoNumberFilter, 1);
    addFilter();
    fillUpFilterValues(demoNotValidFilter, 2);
    addFilter();
    fillUpFilterValues(demoEmptyValuesFilter, 3);
    fireEvent.click(comp.getByText("Save"));

    expect(onSave).toHaveBeenCalledTimes(1);
    const { name, action } = sinkProcessor;
    expect(onSave).toHaveBeenCalledWith({
      name,
      action,
      // filters with invalid or empty values are ignored and not included in the request
      filters: [demoStringFilter, demoNumberFilter],
    });
  });

  it("displays source configuration parameters after source selection", async () => {
    const { comp } = setupProcessorEdit({
      getSchema: (): Promise<object> =>
        new Promise<object>((resolve) => {
          resolve(SlackSourceSchema);
        }),
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Source processor"));

    expect(comp.queryByText("Source")).toBeInTheDocument();
    expect(comp.queryByLabelText("Source type")).toBeInTheDocument();
    expect(comp.queryByLabelText("Source type")).toBeEnabled();
    expect(comp.queryByLabelText("Source configuration")).toBeInTheDocument();
    expect(comp.getByLabelText("Source configuration")).toBeDisabled();
    fireEvent.change(comp.getByLabelText("Source type *"), {
      target: { value: schemaCatalog[0].id },
    });

    expect(
      (comp.getByLabelText("Source type *") as HTMLSelectElement).value
    ).toBe(schemaCatalog[0].id);

    await waitFor(() => {
      expect(comp.queryByLabelText("Channel *")).toBeInTheDocument();
      expect(comp.getByLabelText("Channel *")).toBeEnabled();
      expect(comp.queryByLabelText("Token *")).toBeInTheDocument();
      expect(comp.getByLabelText("Token *")).toBeEnabled();
    });
  });

  it("displays action configuration parameters after action selection", async () => {
    const { comp } = setupProcessorEdit({
      getSchema: (): Promise<object> =>
        new Promise<object>((resolve) => {
          resolve(kakfaSinkSchema);
        }),
    });
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Sink processor"));

    expect(comp.queryByText("Action")).toBeInTheDocument();
    expect(comp.queryByLabelText("Action type")).toBeInTheDocument();
    expect(comp.queryByLabelText("Action type")).toBeEnabled();
    expect(comp.queryByLabelText("Action configuration")).toBeInTheDocument();
    expect(comp.getByLabelText("Action configuration")).toBeDisabled();
    fireEvent.change(comp.getByLabelText("Action type *"), {
      target: { value: schemaCatalog[1].id },
    });

    expect(
      (comp.getByLabelText("Action type *") as HTMLSelectElement).value
    ).toBe(schemaCatalog[1].id);

    await waitFor(() => {
      expect(
        comp.queryByLabelText("Action configuration")
      ).not.toBeInTheDocument();
      expect(comp.queryByLabelText("Topic Name *")).toBeInTheDocument();
      expect(comp.getByLabelText("Topic Name *")).toBeEnabled();
    });
  });

  it("should prevent the user from changing the type of an existing processor", async () => {
    const { comp } = setupProcessorEdit({ processor: sinkProcessor });
    await waitForI18n(comp);

    expect(
      comp.queryByLabelText("Select processor type")
    ).not.toBeInTheDocument();

    expect(comp.getByTestId("processor-type-label")).toBeInTheDocument();
    expect(comp.getByTestId("processor-type-label")).toHaveTextContent("Sink");
  });

  it("should disable the source section while editing an existing source processor", async () => {
    const { comp } = setupProcessorEdit({
      processor: sourceProcessor,
      getSchema: (): Promise<object> =>
        new Promise<object>((resolve) => {
          resolve(SlackSourceSchema);
        }),
    });
    await waitForI18n(comp);

    expect(
      (comp.getByLabelText("Source type") as HTMLSelectElement).value
    ).toBe(sourceProcessor.source.type);
    expect(comp.getByLabelText("Source type")).toBeDisabled();
    expect(comp.getByLabelText("Channel *")).toBeDisabled();
    expect(comp.getByLabelText("Token *")).toBeDisabled();
  });

  it("should disable the action section while editing an existing sink processor", async () => {
    const { comp } = setupProcessorEdit({
      processor: sinkProcessor,
      getSchema: (): Promise<object> =>
        new Promise<object>((resolve) => {
          resolve(kakfaSinkSchema);
        }),
    });
    await waitForI18n(comp);

    expect(
      (comp.getByLabelText("Action type") as HTMLSelectElement).value
    ).toBe(sinkProcessor.action.type);
    expect(comp.getByLabelText("Action type")).toBeDisabled();
    expect(comp.getByLabelText("Topic Name *")).toBeDisabled();
  });

  it("saves default values inside action/source configuration when the user doesn't change them", async () => {
    const { comp, onSave } = setupProcessorEdit({
      getSchema: (): Promise<object> =>
        new Promise<object>((resolve) => {
          resolve(kakfaSinkSchema);
        }),
    });
    await waitForI18n(comp);

    const processorName = "Test Processor";
    const topic = "test-topic";
    const defaultDelay = kakfaSinkSchema.properties.delay.default;

    fireEvent.click(comp.getByText("Sink processor"));

    fireEvent.change(comp.getByLabelText("Processor name *"), {
      target: { value: processorName },
    });

    fireEvent.change(comp.getByLabelText("Action type *"), {
      target: { value: schemaCatalog[1].id },
    });

    await waitFor(() => {
      expect(comp.queryByLabelText("Topic Name *")).toBeInTheDocument();
      expect(comp.getByLabelText("Topic Name *")).toBeEnabled();
    });

    fireEvent.change(comp.getByLabelText("Topic Name *"), {
      target: { value: topic },
    });
    expect((comp.getByLabelText("Delay") as HTMLSelectElement).value).toBe(
      defaultDelay.toString()
    );

    fireEvent.click(comp.getByText("Create"));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      name: processorName,
      action: {
        type: schemaCatalog[1].id,
        parameters: {
          topic,
          delay: defaultDelay,
        },
      },
    });
  });

  it("shows malformed transformation template error, when raised", async () => {
    const querySelector = jest.fn();
    Object.defineProperty(global.document, "querySelector", {
      value: querySelector,
    });
    const malformedTransformationTemplate = "template error";
    const { comp } = setupProcessorEdit({
      malformedTransformationTemplate,
      processor: {
        id: "f8f34af4-caed-11ec-9d64-0242ac120002",
        submitted_at: "2022-04-15T12:10:46.029400+0000",
        published_at: "2022-04-15T12:12:52.416527+0000",
        status: ManagedResourceStatus.Ready,
        name: "Processor name",
        type: ProcessorType.Sink,
        kind: "Bridge",
        href: "/api/smartevents_mgmt/v1/bridges/f8f34af4-caed-11ec-9d64-0242ac120002",
        owner: "bebianco@redhat.com",
      },
    });
    await waitForI18n(comp);

    expect(querySelector).toHaveBeenCalled();
    expect(
      comp.baseElement.querySelector(
        ".processor-edit__transformation-template__helper-text"
      )
    ).toHaveTextContent(malformedTransformationTemplate);
  });
});

const baseProcessor = {
  id: "f8f34af4-caed-11ec-9d64-0242ac120002",
  name: "Processor",
  submitted_at: "2022-04-15T12:10:46.029400+0000",
  published_at: "2022-04-15T12:12:52.416527+0000",
  status: ManagedResourceStatus.Ready,
  kind: "Bridge",
  href: "/api/smartevents_mgmt/v1/bridges/f8f34af4-caed-11ec-9d64-0242ac120002",
  owner: "bebianco@redhat.com",
};

const sourceProcessor = {
  ...baseProcessor,
  type: ProcessorType.Source,
  source: {
    type: "slack_source_0.1",
    parameters: {
      slack_channel: "test",
      slack_token: "XXXXXXXXXXXX",
      data_shape: {
        produces: {
          format: "application/json",
        },
      },
    },
  },
};

const sinkProcessor = {
  ...baseProcessor,
  type: ProcessorType.Sink,
  action: {
    type: "kafka_topic_sink_0.1",
    parameters: {
      topic: "test",
    },
  },
};

// mocked catalog with one source and one sink
const schemaCatalog = [
  {
    kind: "ProcessorSchemaEntry",
    id: "slack_source_0.1",
    name: "Slack Source",
    description: "Ingest data from a Slack channel.",
    type: "source",
    href: "/api/smartevents_mgmt/v1/schemas/sources/slack_source_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "kafka_topic_sink_0.1",
    name: "Kafka Topic",
    description: "Send the event to a kafka topic.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/kafka_topic_sink_0.1",
  },
];

const kakfaSinkSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topic: {
      type: "string",
      title: "Topic Name",
      description: "The topic where to send the event.",
      example: "my-topic",
    },
    delay: {
      type: "integer",
      description: "Delay",
      title: "Delay",
      default: 500,
    },
  },
  required: ["topic"],
};

const SlackSourceSchema = {
  type: "object",
  additionalProperties: false,
  required: ["slack_channel", "slack_token"],
  properties: {
    slack_channel: {
      title: "Channel",
      description: "The Slack channel to receive messages from",
      type: "string",
      example: "#myroom",
    },
    slack_token: {
      title: "Token",
      "x-group": "credentials",
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
