import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BOProcessorList } from "../Components/BOProcessorList";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export default {
  title: "Bridge/Bridge overview/Processor",
  component: BOProcessorList,
} as ComponentMeta<typeof BOProcessorList>;

const ProcesorData = [
  {
    name: "disk space cleanup",
    connectors: ["Ansible playbook", "AI/ML learning Azure Database"],
    status: ManagedResourceStatus.Ready,
  },
  {
    name: "confirmed order analysis",
    connectors: ["AI/ML learning Azure Database"],
    status: ManagedResourceStatus.Failed,
  },
  {
    name: "invoices generation and fulfillment notification",
    connectors: ["Azure Bigdata serverless Sink"],
    status: ManagedResourceStatus.Failed,
  },
];
const Template: ComponentStory<typeof BOProcessorList> = (args) => (
  <BOProcessorList {...args} />
);

export const WithoutData = Template.bind({});
WithoutData.args = {
  processorList: [],
  onAddingProcessor: (): void => {},
};

export const WithData = Template.bind({});
WithData.args = {
  processorList: ProcesorData,
  onAddingProcessor: (): void => {},
};
