import {
  CloudProviderResponse,
  CloudProvidersApi,
  Configuration,
} from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useGetCloudProvidersApi(): {
  getCloudProviders: GetCloudProviders;
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getCloudProviders = useCallback(() => {
    const cloudProvidersApi = new CloudProvidersApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    return cloudProvidersApi
      .listCloudProviders()
      .then((response) => response.data.items ?? []);
  }, [getToken, apiBaseUrl]);

  return { getCloudProviders };
}

export type GetCloudProviders = () => Promise<CloudProviderResponse[]>;
