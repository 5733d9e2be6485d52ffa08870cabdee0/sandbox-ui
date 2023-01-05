/* eslint-disable @typescript-eslint/await-thenable */

import { CloudProviderWithRegions } from "@app/Instance/CreateInstance/types";
import { PlayFunction } from "@storybook/csf";
import { ReactFramework } from "@storybook/react";
import { expect } from "@storybook/jest";
import { CreateInstanceProps } from "@app/Instance/CreateInstance/CreateInstance";
import { userEvent, waitFor, within } from "@storybook/testing-library";

export const cloudRegion = {
  kind: "CloudRegion",
  name: "us-east-1",
  display_name: "US East, N. Virginia",
  enabled: true,
};

export const cloudProvider: CloudProviderWithRegions = {
  kind: "CloudProvider",
  id: "aws",
  name: "aws",
  href: "/api/v1/cloud_providers/aws",
  display_name: "Amazon Web Services",
  enabled: true,
  regions: [cloudRegion],
};

export const cloudProviderUnavailable: CloudProviderWithRegions = {
  ...cloudProvider,
  regions: [{ ...cloudRegion, enabled: false }],
};

export const sampleSubmit: PlayFunction<
  ReactFramework,
  CreateInstanceProps
> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await waitFor(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      expect(canvas.getByLabelText("Name *")).toBeEnabled();
    },
    { timeout: 3000 }
  );

  await userEvent.type(await canvas.findByLabelText("Name *"), "Instance name");
  await userEvent.click(await canvas.getByText("Create Smart Events instance"));
};
