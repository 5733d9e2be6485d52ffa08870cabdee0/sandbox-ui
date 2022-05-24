import {
  BridgeListResponse,
  BridgesApi,
  Configuration,
} from "@openapi/generated";
import { useCallback, useRef, useState } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";
import axios, { CancelTokenSource } from "axios";

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
  const config = useConfig();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.smart_events.getToken()) || "";
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
          basePath: config.smart_events.apiBasePath,
        })
      );
      bridgeApi
        .getBridges(pageReq, sizeReq, {
          cancelToken: source.token,
        })
        .then((response) => {
          setBridgeListResponse(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setError(err);
            setIsLoading(false);
          }
        });
    },
    [getToken, config]
  );

  return { getBridges, isLoading, bridgeListResponse, error };
}
