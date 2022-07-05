import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  BridgeResponse,
} from "@openapi/generated";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useCreateBridgeApi(): {
  // revert to BridgeRequest when the corresponding BE PR will be merged
  // and also pass cloud_provider and region to the createBridge call.
  // createBridge: (bridgeRequest: BridgeRequest) => void;
  createBridge: (bridgeRequest: {
    name: string;
    cloud_provider: string;
    region: string;
  }) => void;
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
