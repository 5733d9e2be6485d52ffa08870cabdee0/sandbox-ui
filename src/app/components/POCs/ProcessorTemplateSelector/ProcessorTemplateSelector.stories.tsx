import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ProcessorTemplateSelector } from "@app/components/POCs/ProcessorTemplateSelector/ProcessorTemplateSelector";
import { PROCESSOR_TEMPLATES } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";

export default {
  title: "PoCs/Create Processor/Components/Template Selector",
  component: ProcessorTemplateSelector,
} as ComponentMeta<typeof ProcessorTemplateSelector>;

const Template: ComponentStory<typeof ProcessorTemplateSelector> = (args) => (
  <ProcessorTemplateSelector {...args} />
);

export const TemplateSelection = Template.bind({});

TemplateSelection.args = {
  templates: PROCESSOR_TEMPLATES,
  selectedTemplate: PROCESSOR_TEMPLATES[0].id,
};
