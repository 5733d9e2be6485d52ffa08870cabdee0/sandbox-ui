import React from "react";
import { customRender, waitForI18n } from "@utils/testUtils";
import ProcessorDetail from "./ProcessorDetail";
import {
  DataShapeValue,
  SinkProcessor,
  SourceProcessor,
} from "../../../types/Processor";
import {
  ManagedResourceStatus,
  ProcessorType,
} from "@rhoas/smart-events-management-sdk";

describe("ProcessorDetail component", () => {
  it("should display sink processor information", async () => {
    const comp = customRender(
      <ProcessorDetail
        processor={sinkProcessor}
        schemaCatalog={schemaCatalog}
        getSchema={(): Promise<object> =>
          new Promise<object>((resolve) => {
            resolve(slackSinkSchema);
          })
        }
      />
    );
    await waitForI18n(comp);

    expect(comp.getByText("Processor type")).toBeInTheDocument();

    expect(comp.getByTestId("processor-type-label")).toHaveTextContent("Sink");

    expect(comp.queryByText("Filters")).toBeInTheDocument();

    const filtersComponent = comp.container.querySelector(
      "[data-ouia-component-id='filters']"
    );
    expect(filtersComponent).toHaveTextContent(
      sinkProcessor.filters?.[0].key as string
    );
    expect(filtersComponent).toHaveTextContent("String contains");
    expect(filtersComponent).toHaveTextContent(
      sinkProcessor.filters?.[0].value as string
    );
    expect(filtersComponent).toHaveTextContent(
      sinkProcessor.filters?.[1].key as string
    );
    expect(filtersComponent).toHaveTextContent("String equals");
    expect(filtersComponent).toHaveTextContent(
      sinkProcessor.filters?.[1].value as string
    );

    expect(
      comp.queryByText(sinkProcessor.transformationTemplate as string)
    ).toBeInTheDocument();

    expect(comp.queryByText("Action")).toBeInTheDocument();
    expect(comp.queryByText("Slack")).toBeInTheDocument();
    expect(
      comp.queryByText(
        (sinkProcessor.action.parameters as { [key: string]: unknown })
          .slack_channel as string
      )
    ).toBeInTheDocument();
    expect(
      comp.queryByText(
        (sinkProcessor.action.parameters as { [key: string]: unknown })
          .slack_webhook_url as string
      )
    ).toBeInTheDocument();

    expect(
      comp.queryByText(
        getDataShapeValue(
          sinkProcessor.action.parameters as { [key: string]: unknown },
          sinkProcessor.type
        )
      )
    ).toBeInTheDocument();

    expect(comp.queryByText("Source")).not.toBeInTheDocument();
  });

  it("should display source processor information", async () => {
    const comp = customRender(
      <ProcessorDetail
        processor={sourceProcessor}
        schemaCatalog={schemaCatalog}
        getSchema={(): Promise<object> =>
          new Promise<object>((resolve) => {
            resolve(slackSourceSchema);
          })
        }
      />
    );
    await waitForI18n(comp);

    expect(comp.getByText("Processor type")).toBeInTheDocument();

    expect(comp.getByTestId("processor-type-label")).toHaveTextContent(
      "Source"
    );

    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(
      comp.queryByText(sourceProcessor.filters?.[0].key as string)
    ).toBeInTheDocument();
    expect(comp.queryByText("String contains")).toBeInTheDocument();
    expect(
      comp.queryByText(sourceProcessor.filters?.[0].value as string)
    ).toBeInTheDocument();

    expect(
      comp.queryByText(sourceProcessor.transformationTemplate as string)
    ).not.toBeInTheDocument();

    expect(comp.queryByText("Slack Source")).toBeInTheDocument();
    expect(
      comp.queryByText(
        (sourceProcessor.source.parameters as { [key: string]: unknown })
          .slack_channel as string
      )
    ).toBeInTheDocument();

    expect(
      comp.queryByText(
        (sourceProcessor.source.parameters as { [key: string]: unknown })
          .slack_token as string
      )
    ).toBeInTheDocument();
    expect(
      comp.queryByText(
        (sourceProcessor.source.parameters as { [key: string]: unknown })
          .slack_delay as string
      )
    ).toBeInTheDocument();

    expect(
      comp.queryByText(
        getDataShapeValue(
          sourceProcessor.source.parameters as { [key: string]: unknown },
          sourceProcessor.type
        )
      )
    ).toBeInTheDocument();

    expect(comp.queryByText("Sink")).not.toBeInTheDocument();
    expect(comp.queryByText("Action")).not.toBeInTheDocument();
  });
});

const baseProcessor = {
  name: "My processor",
  status: ManagedResourceStatus.Ready,
  transformationTemplate: "Hello, there's a new message: {data.message}",
};

const sinkProcessor: SinkProcessor = {
  ...baseProcessor,
  type: "sink",
  filters: [
    {
      key: "source",
      type: "StringContains",
      value: "aws.ec2",
    },
    {
      key: "detail-type",
      type: "StringEquals",
      value: "EC2 Instance State-change Notification",
    },
  ],
  action: {
    type: "slack_sink_0.1",
    parameters: {
      slack_channel: "test",
      slack_webhook_url:
        "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
      data_shape: {
        consumes: {
          format: "application/octet-stream",
        },
      },
    },
  },
};

const sourceProcessor: SourceProcessor = {
  ...baseProcessor,
  type: "source",
  filters: [
    {
      key: "section",
      type: "StringContains",
      value: "33",
    },
  ],
  source: {
    type: "slack_source_0.1",
    parameters: {
      data_shape: {
        produces: {
          format: "application/json",
        },
      },
      slack_channel: "#test",
      slack_token: "testtoken",
      slack_delay: "1s",
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
    id: "slack_sink_0.1",
    name: "Slack",
    description: "Send the event to a slack channel.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/slack_sink_0.1",
  },
];

const slackSinkSchema = {
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
    slack_icon_emoji: {
      title: "Icon Emoji",
      description: "Use a Slack emoji as an avatar.",
      type: "string",
    },
    slack_icon_url: {
      title: "Icon URL",
      description:
        "The avatar that the component will use when sending message to a channel or user.",
      type: "string",
    },
    slack_username: {
      title: "Username",
      description:
        "This is the username that the bot will have when sending messages to a channel or user.",
      type: "string",
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

const slackSourceSchema = {
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
    slack_delay: {
      title: "Delay",
      description: "The delay between polls",
      type: "string",
      example: "1s",
    },
    kafka_topic: {
      title: "Topic Names",
      description: "Comma separated list of Kafka topic names",
      type: "string",
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
    processors: {},
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

const getDataShapeValue = (
  parameters: { [key: string]: unknown },
  type: ProcessorType
): string => {
  const key = type === ProcessorType.Sink ? "consumes" : "produces";
  return (parameters.data_shape as DataShapeValue)[key].format;
};
