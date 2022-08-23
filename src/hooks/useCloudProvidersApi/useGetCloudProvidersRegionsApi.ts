import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import {
  CloudProvidersApi,
  CloudRegionResponse,
  Configuration,
} from "@rhoas/smart-events-management-sdk";

export function useGetCloudProvidersRegions(): {
  getCloudProviderRegions: GetCloudProvidersRegion;
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getCloudProviderRegions = useCallback(
    (cloudProviderId: string) => {
      const cloudProvidersApi = new CloudProvidersApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );

      return cloudProvidersApi
        .listCloudProviderRegions(cloudProviderId)
        .then((response) => response.data.items);
    },
    [getToken, apiBaseUrl]
  );

  return { getCloudProviderRegions };
}

export type GetCloudProvidersRegion = (
  cloudProviderId: string
) => Promise<CloudRegionResponse[] | undefined>;
