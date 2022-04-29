import {
  BridgesApi,
  Configuration,
  InlineResponse202,
} from "@openapi/generated";
import { useState } from "react";

export function useGetBridgeApi(
  accessToken: string,
  basePath: string
): {
  getBridge: (bridgeId: string) => Promise<void>;
  bridge?: InlineResponse202;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<InlineResponse202>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getBridge = async (bridgeId: string): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await bridgeApi
      .getBridge(bridgeId)
      .then((response) => setBridge(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { getBridge, isLoading, bridge, error };
}
