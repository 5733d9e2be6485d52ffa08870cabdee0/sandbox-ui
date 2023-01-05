import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PageNotFound } from "@app/components/PageNotFound/PageNotFound";

export default {
  title: "Shared/PageNotFound",
  component: PageNotFound,
} as ComponentMeta<typeof PageNotFound>;

const Template: ComponentStory<typeof PageNotFound> = () => <PageNotFound />;

export const PageNotFoundBase = Template.bind({});
