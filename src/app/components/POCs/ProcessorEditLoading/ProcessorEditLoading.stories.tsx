import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";
import ProcessorEditLoading from "@app/components/POCs/ProcessorEditLoading/ProcessorEditLoading";
import { Page } from "@patternfly/react-core";

export default {
  title: "PoCs/Create Processor/Components/Loading",
  component: ProcessorEditLoading,
} as ComponentMeta<typeof ProcessorEditLoading>;

const Template: ComponentStory<typeof ProcessorEditLoading> = (args) => (
  <Page>
    <ProcessorEditLoading {...args} />
  </Page>
);

export const Base = Template.bind({});
