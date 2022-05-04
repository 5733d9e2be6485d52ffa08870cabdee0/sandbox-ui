import { BridgesApi, Configuration, BridgeResponse } from "@openapi/generated";
import { useCallback, useState } from "react";

export function useGetBridgeApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  getBridge: (bridgeId: string) => Promise<void>;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getBridge = useCallback(
    async (bridgeId: string): Promise<void> => {
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath,
        })
      );
      await bridgeApi
        .getBridge(bridgeId)
        .then((response) => setBridge(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken, basePath]
  );

  return { getBridge, isLoading, bridge, error };
}
