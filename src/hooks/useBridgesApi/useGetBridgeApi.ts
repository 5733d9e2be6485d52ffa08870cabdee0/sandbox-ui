import { BridgesApi, Configuration, BridgeResponse } from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth } from "@rhoas/app-services-ui-shared";
import config from "../../../config/config";

export function useGetBridgeApi(): {
  getBridge: (bridgeId: string) => void;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const getBridge = useCallback(
    (bridgeId: string): void => {
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: config.apiBasePath,
        })
      );
      bridgeApi
        .getBridge(bridgeId)
        .then((response) => setBridge(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken]
  );

  return { getBridge, isLoading, bridge, error };
}
