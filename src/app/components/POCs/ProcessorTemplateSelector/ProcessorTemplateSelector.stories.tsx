import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ProcessorTemplateSelector } from "@app/components/POCs/ProcessorTemplateSelector/ProcessorTemplateSelector";

export default {
  title: "PoCs/Processor Template Selector",
  component: ProcessorTemplateSelector,
} as ComponentMeta<typeof ProcessorTemplateSelector>;

const Template: ComponentStory<typeof ProcessorTemplateSelector> = () => (
  <ProcessorTemplateSelector />
);

export const Test = Template.bind({});
Test.args = {};
