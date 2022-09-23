import { CloudProviderWithRegions } from "@app/Instance/CreateBridge/types";

export const getFirstAvailableRegion = (
  providers: CloudProviderWithRegions[]
): { providerId: string | undefined; regionId: string | undefined } => {
  let providerId;
  let regionId;
  const filteredProviders = providers.filter((provider) => provider.enabled);
  for (let i = 0; i < filteredProviders.length; i++) {
    const region = filteredProviders[i].regions.find(
      (region) => region.enabled
    );
    if (region) {
      providerId = filteredProviders[i].id;
      regionId = region.name;
      break;
    }
  }
  return { providerId, regionId };
};
