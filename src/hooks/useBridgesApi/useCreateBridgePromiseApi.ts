import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  BridgeResponse,
} from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useCreateBridgePromiseApi(): {
  createBridgePromise: CreateBridgePromise;
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const createBridgePromise = useCallback(
    (bridgeRequest: BridgeRequest): Promise<BridgeResponse> => {
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      return bridgeApi
        .createBridge(bridgeRequest)
        .then((response) => response.data);
    },
    [apiBaseUrl, getToken]
  );

  return { createBridgePromise };
}

export type CreateBridgePromise = (
  bridgeRequest: BridgeRequest
) => Promise<BridgeResponse>;
