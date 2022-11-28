import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Breadcrumb } from "./Breadcrumb";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Shared/Breadcrumb",
  component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args} />
);

export const Example = Template.bind({});

Example.args = {
  path: [
    { label: "Smart Event Instances", linkTo: "/" },
    { label: "Bridge name", linkTo: `/instance/12345` },
    { label: "Create Processor" },
  ],
};
