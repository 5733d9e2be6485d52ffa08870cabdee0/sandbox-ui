import React from "react";
import { customRender, waitForI18n } from "../../../utils/testUtils";
import ProcessorDetail from "./ProcessorDetail";
import { SinkProcessor, SourceProcessor } from "../types";

describe("ProcessorDetail component", () => {
  it("should display sink processor information", async () => {
    const comp = customRender(<ProcessorDetail processor={sinkProcessor} />);
    await waitForI18n(comp);

    expect(comp.getByText("Processor type")).toBeInTheDocument();

    expect(comp.getByTestId("processor-type-label")).toHaveTextContent("Sink");

    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.queryByText(sinkProcessor.filters![0].key)).toBeInTheDocument();
    expect(comp.queryByText("String contains")).toBeInTheDocument();
    expect(
      comp.queryByText(sinkProcessor.filters![0].value)
    ).toBeInTheDocument();
    expect(comp.queryByText(sinkProcessor.filters![1].key)).toBeInTheDocument();
    expect(comp.queryByText("String equals")).toBeInTheDocument();
    expect(
      comp.queryByText(sinkProcessor.filters![1].value)
    ).toBeInTheDocument();

    expect(
      comp.queryByText(sinkProcessor.transformationTemplate!)
    ).toBeInTheDocument();

    expect(comp.queryByText("Action")).toBeInTheDocument();
    expect(comp.queryByText("Send to Slack")).toBeInTheDocument();
    expect(
      comp.queryByText(sinkProcessor.action.parameters.channel)
    ).toBeInTheDocument();
    expect(
      comp.queryByText(sinkProcessor.action.parameters.webhookUrl)
    ).toBeInTheDocument();

    expect(comp.queryByText("Source")).not.toBeInTheDocument();
  });

  it("should display source processor information", async () => {
    const comp = customRender(<ProcessorDetail processor={sourceProcessor} />);
    await waitForI18n(comp);

    expect(comp.getByText("Processor type")).toBeInTheDocument();

    expect(comp.getByTestId("processor-type-label")).toHaveTextContent(
      "Source"
    );

    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(
      comp.queryByText(sourceProcessor.filters![0].key)
    ).toBeInTheDocument();
    expect(comp.queryByText("String contains")).toBeInTheDocument();
    expect(
      comp.queryByText(sourceProcessor.filters![0].value)
    ).toBeInTheDocument();

    expect(
      comp.queryByText(sourceProcessor.transformationTemplate!)
    ).toBeInTheDocument();

    expect(comp.queryByText("Demo source")).toBeInTheDocument();
    expect(
      comp.queryByText(sourceProcessor.source.parameters.demoParameter)
    ).toBeInTheDocument();

    expect(comp.queryByText("Sink")).not.toBeInTheDocument();
    expect(comp.queryByText("Action")).not.toBeInTheDocument();
  });
});

const sinkProcessor: SinkProcessor = {
  name: "My processor",
  status: "ready",
  type: "sink",
  filters: [
    {
      key: "source",
      type: "stringContains",
      value: "aws.ec2",
    },
    {
      key: "detail-type",
      type: "stringEquals",
      value: "EC2 Instance State-change Notification",
    },
  ],
  transformationTemplate: "Hello, there's a new message: {data.message}",
  action: {
    type: "Slack",
    parameters: {
      channel: "Demo Channel",
      webhookUrl:
        "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    },
  },
};

const sourceProcessor: SourceProcessor = {
  name: "My processor",
  status: "ready",
  type: "source",
  filters: [
    {
      key: "section",
      type: "stringContains",
      value: "33",
    },
  ],
  transformationTemplate: "Hello, there's a new message: {data.message}",
  source: {
    type: "Demo source",
    parameters: {
      demoParameter: "Demo value",
    },
  },
};
