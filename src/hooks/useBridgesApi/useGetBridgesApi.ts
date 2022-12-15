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
  getBridges: (
    pageReq?: number,
    sizeReq?: number,
    nameReq?: string,
    statusesReq?: ManagedResourceStatus[],
    isPolling?: boolean
  ) => void;
  bridgeListResponse?: BridgeListResponse;
  error: unknown;
} {
  const [bridgeListResponse, setBridgeListResponse] =
    useState<BridgeListResponse>();
  const [error, setError] = useState<unknown>();
  const prevCallTokenSource = useRef<CancelTokenSource>();
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getBridges = useCallback(
    (
      pageReq?: number,
      sizeReq?: number,
      nameReq?: string,
      statusesReq?: ManagedResourceStatus[],
      isPolling = false
    ): void => {
      if (!isPolling) {
        setBridgeListResponse(undefined);
      }
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

      /** First page number, for the APIs, is 0 (instead of 1) */
      const pageNumber = pageReq !== undefined ? pageReq - 1 : pageReq;

      bridgeApi
        .getBridges(
          nameReq,
          pageNumber,
          sizeReq,
          new Set<ManagedResourceStatus>(statusesReq),
          {
            cancelToken: source.token,
          }
        )
        .then((response) => {
          setBridgeListResponse(response.data);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setError(err);
          }
        });
    },
    [getToken, apiBaseUrl]
  );

  return { getBridges, bridgeListResponse, error };
}
