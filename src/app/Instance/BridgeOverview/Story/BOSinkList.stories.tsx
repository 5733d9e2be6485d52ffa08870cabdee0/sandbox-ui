import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BOSinkList } from "../Components/BOSinkList";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export default {
  title: "Bridge/Bridge overview/SinkConnector",
  component: BOSinkList,
} as ComponentMeta<typeof BOSinkList>;

const SinkConnectorData = [
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
const Template: ComponentStory<typeof BOSinkList> = (args) => (
  <BOSinkList {...args} />
);

export const WithoutData = Template.bind({});
WithoutData.args = {
  sinkList: [],
  onAddingSinkConnector: (): void => {},
};

export const WithData = Template.bind({});
WithData.args = {
  sinkList: SinkConnectorData,
  onAddingSinkConnector: (): void => {},
};
