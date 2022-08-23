import {
  BridgesApi,
  Configuration,
  BridgeResponse,
} from "@rhoas/smart-events-management-sdk";
import { useCallback, useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useGetBridgeApi(): {
  getBridge: (bridgeId: string) => void;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getBridge = useCallback(
    (bridgeId: string): void => {
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      bridgeApi
        .getBridge(bridgeId)
        .then((response) => setBridge(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken, apiBaseUrl]
  );

  return { getBridge, isLoading, bridge, error };
}
