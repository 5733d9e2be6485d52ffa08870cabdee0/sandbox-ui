import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { DeleteModal } from "@app/components/DeleteModal/DeleteModal";

export default {
  title: "Shared/DeleteModal",
  component: DeleteModal,
  args: {
    ouiaId: "delete-modal-story",
    showDialog: true,
    onCancel: () => {},
    onConfirm: () => {},
  },
} as ComponentMeta<typeof DeleteModal>;

const Template: ComponentStory<typeof DeleteModal> = (args) => (
  <DeleteModal {...args} />
);

export const DeleteInstance = Template.bind({});
DeleteInstance.args = {
  modalTitle: "Delete Instance",
  resourceName: "My Instance",
  resourceType: "Instance",
};

export const DeleteInstanceCheckAvailability = Template.bind({});
DeleteInstanceCheckAvailability.storyName =
  "Delete Instance - Check availability";
DeleteInstanceCheckAvailability.args = {
  modalTitle: "Delete Instance",
  resourceName: "My Instance",
  resourceType: "Instance",
  isPreloading: true,
};

export const DeleteInstanceNotPossible = Template.bind({});
DeleteInstanceNotPossible.storyName = "Delete Instance - Not possible";
DeleteInstanceNotPossible.args = {
  modalTitle: "Delete Instance",
  resourceName: "My Instance",
  resourceType: "Instance",
  blockedDeletionReason:
    'The "My Instance" Smart Events instance cannot be deleted until all associated processors are deleted.',
};

export const DeleteInstanceError = Template.bind({});
DeleteInstanceError.storyName = "Delete Instance - Generic error";
DeleteInstanceError.args = {
  modalTitle: "Delete Instance",
  resourceName: "My Instance",
  resourceType: "Instance",
  blockedDeletionReason:
    "It is not possible to delete this Smart Events instance. Try again later.",
};
