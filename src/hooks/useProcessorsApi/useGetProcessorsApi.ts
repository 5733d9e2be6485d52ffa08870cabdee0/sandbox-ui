import {
  Configuration,
  ManagedResourceStatus,
  ProcessorListResponse,
  ProcessorsApi,
  ProcessorType,
} from "@rhoas/smart-events-management-sdk";
import { useCallback, useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useGetProcessorsApi(): {
  getProcessors: (
    bridgeId: string,
    pageReq?: number,
    sizeReq?: number,
    processorType?: ProcessorType,
    isPolling?: boolean
  ) => void;
  processorListResponse?: ProcessorListResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processorListResponse, setProcessorListResponse] =
    useState<ProcessorListResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const prevCallTokenSource = useRef<CancelTokenSource>();
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getProcessors = useCallback(
    (
      bridgeId: string,
      pageReq?: number,
      sizeReq?: number,
      processorType?: ProcessorType,
      isPolling?: boolean
    ): void => {
      setIsLoading(!isPolling); // no loading, when the call is generated from a polling
      prevCallTokenSource.current?.cancel();

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      prevCallTokenSource.current = source;

      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      processorsApi
        .listProcessors(
          bridgeId,
          undefined,
          pageReq,
          sizeReq,
          new Set<ManagedResourceStatus>(),
          processorType ?? undefined,
          {
            cancelToken: source.token,
          }
        )
        .then((response) => {
          setProcessorListResponse(response.data);
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

  return { getProcessors, isLoading, processorListResponse, error };
}
