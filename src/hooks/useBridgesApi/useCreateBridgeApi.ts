import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  BridgeResponse,
} from "@openapi/generated";
import { useState } from "react";

export function useCreateBridgeApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  createBridge: (bridgeRequest: BridgeRequest) => Promise<void>;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const createBridge = async (bridgeRequest: BridgeRequest): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await bridgeApi
      .createBridge(bridgeRequest)
      .then((response) => setBridge(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { createBridge, isLoading, bridge, error };
}
