import { BridgeResponse } from "@rhoas/smart-events-management-sdk";

type RegionDetails = {
  value: string;
  label: string;
};
export type CloudProviderDetails = {
  value: string;
  label: string;
  region: RegionDetails[];
};

const cloudProviderOptions: CloudProviderDetails[] = [
  {
    value: "aws",
    label: "Amazon Web Services",
    region: [{ value: "us-east-1", label: "US East, N. Virginia" }],
  },
];

export const getUpdatedCloudProviders = (
  instance: BridgeResponse
): {
  updatedCloudProvider: CloudProviderDetails | undefined;
  updatedCloudRegion: RegionDetails | undefined;
} => {
  const updatedCloudProvider = cloudProviderOptions.find(
    (option) => option.value === instance.cloud_provider
  );
  const updatedCloudRegion = updatedCloudProvider?.region.find(
    (cloudRegion) => cloudRegion.value === instance.region
  );

  return { updatedCloudProvider, updatedCloudRegion };
};
