import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  InlineResponse202,
} from "@openapi/generated";
import { useState } from "react";

export function useCreateBridgeApi(
  accessToken: string,
  basePath: string
): {
  createBridge: (bridgeRequest: BridgeRequest) => Promise<void>;
  bridge?: InlineResponse202;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<InlineResponse202>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const createBridge = async (bridgeRequest: BridgeRequest): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken,
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
