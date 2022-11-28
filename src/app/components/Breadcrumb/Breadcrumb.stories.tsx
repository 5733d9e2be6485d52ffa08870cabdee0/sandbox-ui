import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Breadcrumb } from "./Breadcrumb";

export default {
  title: "Shared/Breadcrumb",
  component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>;

const Template: ComponentStory<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args} />
);

export const MultipleRoutes = Template.bind({});
MultipleRoutes.args = {
  path: [
    { label: "Smart Event Instances", linkTo: "/" },
    { label: "Bridge name", linkTo: `/instance/12345` },
    { label: "Create Processor" },
  ],
};

export const SingleRoute = Template.bind({});
SingleRoute.args = {
  path: [{ label: "Smart Event Instances", linkTo: "/" }],
};
