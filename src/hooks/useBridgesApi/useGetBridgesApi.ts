import {
  BridgeListResponse,
  BridgesApi,
  Configuration,
} from "@openapi/generated";
import { useCallback, useRef, useState } from "react";
import { useAuth } from "@rhoas/app-services-ui-shared";
import axios, { CancelTokenSource } from "axios";
import config from "config/config";

export function useGetBridgesApi(): {
  getBridges: (pageReq?: number, sizeReq?: number, isPolling?: boolean) => void;
  bridgeListResponse?: BridgeListResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridgeListResponse, setBridgeListResponse] =
    useState<BridgeListResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const prevCallTokenSource = useRef<CancelTokenSource>();
  const auth = useAuth();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const getBridges = useCallback(
    (pageReq?: number, sizeReq?: number, isPolling = false): void => {
      setIsLoading(!isPolling); // no loading, when the call is generated from a polling
      prevCallTokenSource.current?.cancel();

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      prevCallTokenSource.current = source;

      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: config.apiBasePath,
        })
      );
      bridgeApi
        .getBridges(pageReq, sizeReq, {
          cancelToken: source.token,
        })
        .then((response) => setBridgeListResponse(response.data))
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setError(err);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [getToken]
  );

  return { getBridges, isLoading, bridgeListResponse, error };
}
