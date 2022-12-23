import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { EmptyStateNoResults } from "@app/components/EmptyState/EmptyStateNoResults";

export default {
  title: "Shared/EmptyState/NoResults",
  component: EmptyStateNoResults,
  args: {
    onClearAllFilters: () => {},
  },
} as ComponentMeta<typeof EmptyStateNoResults>;

const Template: ComponentStory<typeof EmptyStateNoResults> = (args) => (
  <EmptyStateNoResults {...args} />
);

export const NoResults = Template.bind({});
NoResults.args = {
  title: "No Smart Event instances",
  bodyMsgI18nKey: "common.adjustYourFilters",
};
