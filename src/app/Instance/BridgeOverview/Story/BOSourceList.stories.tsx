import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BOSourceList } from "../Components/BOSourceList";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export default {
  title: "Bridge/Bridge overview/SourceConnector",
  component: BOSourceList,
} as ComponentMeta<typeof BOSourceList>;

const SourceConnectorData = [
  {
    name: " disk space cleanup",
    connectors: ["Ansible playbook", "AI/ML learning Azure Database"],
    status: ManagedResourceStatus.Ready,
  },
  {
    name: " 870 du29c 9nc w 1ik",
    connectors: ["AI/ML learning Azure Database"],
    status: ManagedResourceStatus.Failed,
  },
];
const Template: ComponentStory<typeof BOSourceList> = (args) => (
  <BOSourceList {...args} />
);

export const WithoutData = Template.bind({});
WithoutData.args = {
  sourceList: [],
  onAddingSourceConnector: (): void => {},
};

export const WithData = Template.bind({});
WithData.args = {
  sourceList: SourceConnectorData,
  onAddingSourceConnector: (): void => {},
};
