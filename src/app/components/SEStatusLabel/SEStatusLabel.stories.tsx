import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import SEStatusLabel from "./SEStatusLabel";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { sub } from "date-fns";

export default {
  title: "Shared/SEStatusLabel",
  component: SEStatusLabel,
  args: {
    requestedAt: new Date(),
  },
} as ComponentMeta<typeof SEStatusLabel>;

const Template: ComponentStory<typeof SEStatusLabel> = (args, { viewMode }) => {
  const inDocs = viewMode === "docs";

  return (
    <div style={{ paddingTop: inDocs ? 0 : 250 }}>
      <SEStatusLabel {...args} />
    </div>
  );
};

export const Accepted = Template.bind({});
Accepted.args = {
  status: ManagedResourceStatus.Accepted,
  resourceType: "bridge",
};

export const Preparing = Template.bind({});
Preparing.args = {
  status: ManagedResourceStatus.Preparing,
  resourceType: "bridge",
};

export const Provisioning = Template.bind({});
Provisioning.args = {
  status: ManagedResourceStatus.Provisioning,
  resourceType: "bridge",
};

export const CreatingOver5Minutes = Template.bind({});
CreatingOver5Minutes.args = {
  status: ManagedResourceStatus.Accepted,
  requestedAt: sub(new Date(), { minutes: 6 }),
};

export const CreatingOver10Minutes = Template.bind({});
CreatingOver10Minutes.args = {
  status: ManagedResourceStatus.Accepted,
  requestedAt: sub(new Date(), { minutes: 11 }),
};

export const Ready = Template.bind({});
Ready.args = {
  status: ManagedResourceStatus.Ready,
  resourceType: "bridge",
};

export const Deprovision = Template.bind({});
Deprovision.args = {
  status: ManagedResourceStatus.Deprovision,
  resourceType: "bridge",
};

export const Deleting = Template.bind({});
Deleting.args = {
  status: ManagedResourceStatus.Deleting,
};

export const Deleted = Template.bind({});
Deleted.args = {
  status: ManagedResourceStatus.Deleted,
};
