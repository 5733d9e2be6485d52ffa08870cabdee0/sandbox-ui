import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { EmptyState } from "@app/components/EmptyState/EmptyState";

export default {
  title: "Shared/EmptyState",
  component: EmptyState,
} as ComponentMeta<typeof EmptyState>;

const Template: ComponentStory<typeof EmptyState> = (args) => (
  <EmptyState {...args} />
);

export const EmptyStateBase = Template.bind({});
EmptyStateBase.args = {
  title: "No Smart Event instances",
  createButton: {
    title: "Create Smart Events instance",
    onCreate: (): void => {},
  },
  quickStartGuide: {
    i18nKey: "common.quickStartAccess",
    onQuickstartGuide: (): void => {},
  },
};
