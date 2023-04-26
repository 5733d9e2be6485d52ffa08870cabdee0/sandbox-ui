import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import { ComposableContextSelector } from "./namespace";

export default {
  title: "PoCs/Namespace 4",
  component: ComposableContextSelector,
  args: {},
  decorators: [],
} as ComponentMeta<typeof ComposableContextSelector>;

const Template: ComponentStory<typeof ComposableContextSelector> = (args) => (
  <ComposableContextSelector {...args} />
);

export const Story = Template.bind({});
Story.args = {};
