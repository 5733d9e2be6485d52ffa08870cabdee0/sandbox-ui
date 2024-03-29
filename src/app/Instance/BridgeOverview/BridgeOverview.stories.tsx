import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { BridgeOverview } from "./BridgeOverview";
import { processorData } from "./BOStoriesHelper";

export default {
  title: "PoCs/Bridge Overview",
  component: BridgeOverview,
  args: {
    bridgeIngressEndpoint:
      "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
  },
} as ComponentMeta<typeof BridgeOverview>;

const Template: ComponentStory<typeof BridgeOverview> = (args) => (
  <BridgeOverview {...args} />
);

export const WithoutData = Template.bind({});
WithoutData.args = {
  processorList: [],
  bridgeStatus: ManagedResourceStatus.Ready,
};

export const WithData = Template.bind({});
WithData.args = {
  processorList: processorData,
  bridgeStatus: ManagedResourceStatus.Ready,
};

export const BridgeStatus = Template.bind({});
BridgeStatus.storyName = "Bridge Status - Failed";
BridgeStatus.args = {
  bridgeStatus: ManagedResourceStatus.Failed,
  processorList: [],
};

export const ProcessorsError = Template.bind({});
ProcessorsError.storyName = "Processors Error - Generic";
ProcessorsError.args = {
  processorsError: "generic-error",
};
