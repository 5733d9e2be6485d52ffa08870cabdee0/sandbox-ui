import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { BridgeOverview } from "./BridgeOverview";

export default {
  title: "PoCs/Bridge Overview",
  component: BridgeOverview,
} as ComponentMeta<typeof BridgeOverview>;

const processorData = [
  {
    kind: "Processor",
    id: "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    name: "Processor one",
    type: "sink",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    submitted_at: "2022-04-12T12:10:46.029400+0000",
    published_at: "2022-04-12T12:12:52.416527+0000",
    status: ManagedResourceStatus.Ready,
    flows: [],
    owner: "",
  },
  {
    kind: "Processor",
    id: "fa373030-c0d2-11ec-9d64-0242ac120002",
    name: "Processor two",
    type: "sink",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/fa373030-c0d2-11ec-9d64-0242ac120002",
    submitted_at: "2022-04-15T12:10:46.029400+0000",
    published_at: "2022-04-15T12:12:52.416527+0000",
    status: ManagedResourceStatus.Failed,
    flows: [],
    owner: "",
  },
  {
    kind: "Processor",
    id: "f8f34af4-caed-11ec-9d64-0242ac120002",
    name: "Processor three",
    type: "source",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/f8f34af4-caed-11ec-9d64-0242ac120002",
    submitted_at: "2022-04-15T12:10:46.029400+0000",
    published_at: "2022-04-15T12:12:52.416527+0000",
    status: ManagedResourceStatus.Accepted,
    flows: [],
    owner: "",
  },
  {
    kind: "Processor",
    id: "sourcef4-ead8-6g8v-as8e-0642tdjek002",
    name: "Processor four",
    type: "source",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/sourcef4-ead8-6g8v-as8e-0642tdjek002",
    submitted_at: " ",
    published_at: "2022-05-15T12:12:52.416527+0000",
    status: ManagedResourceStatus.Accepted,
    flows: [],
    owner: "",
  },
];

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
