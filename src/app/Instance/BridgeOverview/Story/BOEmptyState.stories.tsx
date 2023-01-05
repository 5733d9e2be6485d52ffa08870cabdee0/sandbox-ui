import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BOEmptyState } from "@app/Instance/BridgeOverview/Components/BOEmptyState";

export default {
  title: "Bridge/Bridge overview/Bridge overview empty state",
  component: BOEmptyState,
} as ComponentMeta<typeof BOEmptyState>;

const Template: ComponentStory<typeof BOEmptyState> = (args) => (
  <BOEmptyState {...args} />
);

export const EmptyStateSourceConnector = Template.bind({});
EmptyStateSourceConnector.args = {
  title: "No source connectors",
  description:
    "Create a source connector to send events from an external system to this bridge",
  buttonLabel: "Create source connector",
  onButtonClick: (): void => {},
  variant: "secondary",
};

export const EmptyStateProcessor = Template.bind({});
EmptyStateProcessor.args = {
  title: "No processors",
  description:
    "Processors use Camel DSL to filter and transform events before routing events to one or more actions",
  buttonLabel: "Create processor",
  onButtonClick: (): void => {},
  variant: "secondary",
};
export const EmptyStateSink = Template.bind({});
EmptyStateSink.args = {
  title: "No sink connectors",
  description:
    "Create a source connector to send events from an external system to this bridge",
  buttonLabel: "Create sink connector",
  onButtonClick: (): void => {},
  variant: "primary",
};
