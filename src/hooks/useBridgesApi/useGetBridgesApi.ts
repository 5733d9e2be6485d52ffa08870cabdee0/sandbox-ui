import {
  BridgeListResponse,
  BridgesApi,
  Configuration,
} from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth } from "@rhoas/app-services-ui-shared";
import config from "config/config";

export function useGetBridgesApi(): {
  getBridges: (pageReq?: number, sizeReq?: number) => void;
  bridgeListResponse?: BridgeListResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridgeListResponse, setBridgeListResponse] =
    useState<BridgeListResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const getBridges = useCallback(
    (pageReq?: number, sizeReq?: number): void => {
      setIsLoading(true);
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: config.apiBasePath,
        })
      );
      bridgeApi
        .getBridges(pageReq, sizeReq)
        .then((response) => setBridgeListResponse(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken]
  );

  return { getBridges, isLoading, bridgeListResponse, error };
}
