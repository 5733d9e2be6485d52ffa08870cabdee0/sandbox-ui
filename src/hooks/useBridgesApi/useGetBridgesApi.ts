import {
  BridgeListResponse,
  BridgesApi,
  Configuration,
  ManagedResourceStatus,
} from "@rhoas/smart-events-management-sdk";
import { useCallback, useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useSmartEvents } from "@contexts/SmartEventsContext";

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
  const { getToken, apiBaseUrl } = useSmartEvents();

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
          basePath: apiBaseUrl,
        })
      );
      bridgeApi
        .getBridges(
          undefined,
          pageReq,
          sizeReq,
          new Set<ManagedResourceStatus>(),
          {
            cancelToken: source.token,
          }
        )
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
    [getToken, apiBaseUrl]
  );

  return { getBridges, isLoading, bridgeListResponse, error };
}
