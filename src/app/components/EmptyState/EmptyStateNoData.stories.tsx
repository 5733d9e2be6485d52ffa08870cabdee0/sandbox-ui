import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { EmptyStateNoData } from "@app/components/EmptyState/EmptyStateNoData";

export default {
  title: "Shared/EmptyState/NoData",
  component: EmptyStateNoData,
} as ComponentMeta<typeof EmptyStateNoData>;

const Template: ComponentStory<typeof EmptyStateNoData> = (args) => (
  <EmptyStateNoData {...args} />
);

export const NoData = Template.bind({});
NoData.args = {
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
