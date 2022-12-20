/* eslint-disable @typescript-eslint/await-thenable */

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CreateInstance from "@app/Instance/CreateInstance/CreateInstance";
import { CloudProviderWithRegions } from "@app/Instance/CreateInstance/types";
import {
  cloudProvider,
  cloudProviderUnavailable,
  sampleSubmit,
} from "@app/Instance/CreateInstance/storiesHelpers";
import { userEvent, waitFor, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

export default {
  title: "Bridge/Create Smart Events Instance",
  component: CreateInstance,
  args: {
    isOpen: true,
    onClose: () => {},
    getCloudProviders: (): Promise<CloudProviderWithRegions[]> =>
      new Promise<CloudProviderWithRegions[]>((resolve) => {
        resolve([cloudProvider]);
      }),
    createBridge: () => {},
    appendTo: () => document.getElementById("root") || document.body,
  },
} as ComponentMeta<typeof CreateInstance>;

const Template: ComponentStory<typeof CreateInstance> = (args) => {
  return (
    <div>
      <CreateInstance {...args} />
    </div>
  );
};

export const CreateSmartEventsInstance = Template.bind({});
CreateSmartEventsInstance.args = {
  getCloudProviders: (): Promise<CloudProviderWithRegions[]> =>
    new Promise<CloudProviderWithRegions[]>((resolve) => {
      setTimeout(() => {
        resolve([cloudProvider]);
      }, 500);
    }),
};

export const FormValidation = Template.bind({});
FormValidation.play = async ({ canvasElement }): Promise<void> => {
  const canvas = within(canvasElement);

  await waitFor(
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await expect(canvas.getByLabelText("Name *")).toBeEnabled();
    },
    { timeout: 3000 }
  );
  await userEvent.click(await canvas.getByText("Create Smart Events instance"));
};

export const CreationPending = Template.bind({});
CreationPending.args = {
  createBridge: (): void => {
    // Doing nothing to remain in the loading status
  },
};
CreationPending.play = sampleSubmit;

export const ProvidersUnavailable = Template.bind({});
ProvidersUnavailable.args = {
  getCloudProviders: (): Promise<CloudProviderWithRegions[]> =>
    new Promise<CloudProviderWithRegions[]>((resolve) => {
      resolve([cloudProviderUnavailable]);
    }),
};

export const NameAlreadyTakenError = Template.bind({});
NameAlreadyTakenError.storyName = "Creation Error - Name taken";
NameAlreadyTakenError.args = {
  createBridge: (_data, _onSuccess, onError): void => {
    onError("name-taken");
  },
};
NameAlreadyTakenError.play = sampleSubmit;

export const GenericCreationError = Template.bind({});
GenericCreationError.storyName = "Creation Error - Generic error";
GenericCreationError.args = {
  createBridge: (_data, _onSuccess, onError): void => {
    onError("generic-error");
  },
};
GenericCreationError.play = sampleSubmit;

export const CloudProviderUnavailableOnSubmit = Template.bind({});
CloudProviderUnavailableOnSubmit.storyName =
  "Creation Error - Provider no more available";
CloudProviderUnavailableOnSubmit.args = {
  createBridge: (_data, _onSuccess, onError): void => {
    onError("region-unavailable");
  },
};
CloudProviderUnavailableOnSubmit.play = sampleSubmit;

export const QuotaError = Template.bind({});
QuotaError.storyName = "Creation Error - Out of quota";
QuotaError.args = {
  createBridge: (_data, _onSuccess, onError): void => {
    onError("quota-error");
  },
};
QuotaError.play = sampleSubmit;
