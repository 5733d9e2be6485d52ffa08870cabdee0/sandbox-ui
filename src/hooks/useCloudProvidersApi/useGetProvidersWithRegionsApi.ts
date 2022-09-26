import {
  CloudProvidersApi,
  Configuration,
} from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import { CloudProviderWithRegions } from "@app/Instance/CreateInstance/types";
import { CreateInstanceProps } from "@app/Instance/CreateInstance/CreateInstance";

export function useGetCloudProvidersWithRegionsApi(): {
  getCloudProvidersWithRegions: CreateInstanceProps["getCloudProviders"];
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getCloudProvidersWithRegions = useCallback(async () => {
    const cloudProvidersApi = new CloudProvidersApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    try {
      const providersResponse = await cloudProvidersApi.listCloudProviders();
      const providersList = providersResponse.data.items ?? [];

      const providers = await Promise.all(
        providersList.map(async (provider) => {
          const regionsResponse =
            await cloudProvidersApi.listCloudProviderRegions(provider.id);
          const regionsList = regionsResponse.data.items || [];
          const providerInfo: CloudProviderWithRegions = {
            ...provider,
            regions: regionsList,
          };
          return providerInfo;
        })
      );
      return Promise.resolve(providers);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [getToken, apiBaseUrl]);

  return { getCloudProvidersWithRegions };
}
