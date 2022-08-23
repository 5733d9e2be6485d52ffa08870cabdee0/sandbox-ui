import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  BridgeResponse,
} from "@rhoas/smart-events-management-sdk";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useCreateBridgeApi(): {
  createBridge: (bridgeRequest: BridgeRequest) => void;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const { getToken, apiBaseUrl } = useSmartEvents();

  const createBridge = (bridgeRequest: BridgeRequest): void => {
    setIsLoading(true);
    setBridge(undefined);
    setError(undefined);
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    bridgeApi
      .createBridge(bridgeRequest)
      .then((response) => setBridge(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { createBridge, isLoading, bridge, error };
}
