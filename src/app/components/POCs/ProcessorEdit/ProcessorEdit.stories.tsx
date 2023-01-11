import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProcessorEdit from "@app/components/POCs/ProcessorEdit/ProcessorEdit";
import { Page } from "@patternfly/react-core";
import { PROCESSOR_TEMPLATES } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";

export default {
  title: "PoCs/Create Processor",
  component: ProcessorEdit,
  args: {
    onCancel: () => {},
    createProcessor: () => {},
    processorTemplates: PROCESSOR_TEMPLATES,
    sinkValuesSuggestions: ["MyFirstSink", "MySecondSink"],
  },
} as ComponentMeta<typeof ProcessorEdit>;

const Template: ComponentStory<typeof ProcessorEdit> = (args) => {
  return (
    <Page>
      <ProcessorEdit {...args} />
    </Page>
  );
};

export const CreationFlow = Template.bind({});
