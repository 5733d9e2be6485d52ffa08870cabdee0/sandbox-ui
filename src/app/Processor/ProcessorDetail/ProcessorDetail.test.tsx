import React from "react";
import { getParameterValue } from "@utils/parametersUtils";
import { customRender, waitForI18n } from "@utils/testUtils";
import ProcessorDetail from "./ProcessorDetail";
import { SinkProcessor, SourceProcessor } from "../../../types/Processor";

describe("ProcessorDetail component", () => {
  it("should display sink processor information", async () => {
    const comp = customRender(<ProcessorDetail processor={sinkProcessor} />);
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
    expect(comp.queryByText("Send to Slack")).toBeInTheDocument();
    expect(
      comp.queryByText(
        getParameterValue(
          (sinkProcessor.action.parameters as { [key: string]: unknown })
            .channel
        )
      )
    ).toBeInTheDocument();
    expect(
      comp.queryByText(
        getParameterValue(
          (sinkProcessor.action.parameters as { [key: string]: unknown })
            .webhookUrl
        )
      )
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
      comp.queryByText(sourceProcessor.filters?.[0].key as string)
    ).toBeInTheDocument();
    expect(comp.queryByText("String contains")).toBeInTheDocument();
    expect(
      comp.queryByText(sourceProcessor.filters?.[0].value as string)
    ).toBeInTheDocument();

    expect(
      comp.queryByText(sourceProcessor.transformationTemplate as string)
    ).not.toBeInTheDocument();

    expect(comp.queryByText("Demo source")).toBeInTheDocument();
    expect(
      comp.queryByText(
        getParameterValue(
          (sourceProcessor.source.parameters as { [key: string]: unknown })
            .demoParameter
        )
      )
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
      type: "StringContains",
      value: "aws.ec2",
    },
    {
      key: "detail-type",
      type: "StringEquals",
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
      type: "StringContains",
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
