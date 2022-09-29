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

export const getCloudProviderAndRegionForInstance = (
  instance: BridgeResponse
): {
  cloudProvider: CloudProviderDetails | undefined;
  cloudRegion: RegionDetails | undefined;
} => {
  const cloudProvider = cloudProviderOptions.find(
    (option) => option.value === instance.cloud_provider
  );
  const cloudRegion = cloudProvider?.region.find(
    (cloudRegion) => cloudRegion.value === instance.region
  );

  return { cloudProvider, cloudRegion };
};
