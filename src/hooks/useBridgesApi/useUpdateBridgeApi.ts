import {
  BridgeRequest,
  BridgeResponse,
  BridgesApi,
  Configuration,
} from "@rhoas/smart-events-management-sdk";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useUpdateBridgeApi(): {
  updateBridge: (bridgeId: string, bridgeRequest: BridgeRequest) => void;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const { getToken, apiBaseUrl } = useSmartEvents();

  const updateBridge = (
    bridgeId: string,
    bridgeRequest: BridgeRequest
  ): void => {
    setIsLoading(true);
    setError(undefined);
    setBridge(undefined);
    const bridgesApi = new BridgesApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    bridgesApi
      .updateBridge(bridgeId, bridgeRequest)
      .then((response) => setBridge(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { updateBridge, isLoading, bridge, error };
}
