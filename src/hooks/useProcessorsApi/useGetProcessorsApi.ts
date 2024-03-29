import {
  Configuration,
  ManagedResourceStatus,
  ProcessorListResponse,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useCallback, useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import { getUserFacingStatuses, ResourceStatus } from "@utils/statusUtils";

export function useGetProcessorsApi(): {
  getProcessors: (
    bridgeId: string,
    nameReq: string | null,
    pageReq?: number,
    sizeReq?: number,
    statusesReq?: ManagedResourceStatus[],
    isPolling?: boolean
  ) => void;
  processorListResponse?: ProcessorListResponse;
  error: unknown;
} {
  const [processorListResponse, setProcessorListResponse] =
    useState<ProcessorListResponse>();
  const [error, setError] = useState<unknown>();
  const prevCallTokenSource = useRef<CancelTokenSource>();
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getProcessors = useCallback(
    (
      bridgeId: string,
      nameReq: string | null,
      pageReq?: number,
      sizeReq?: number,
      statusesReq?: ManagedResourceStatus[],
      isPolling?: boolean
    ): void => {
      if (!isPolling) {
        setProcessorListResponse(undefined);
      }
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

      /** First page number, for the APIs, is 0 (instead of 1) */
      const pageNumber = pageReq !== undefined ? pageReq - 1 : pageReq;

      processorsApi
        .getProcessors(
          bridgeId,
          nameReq ?? undefined,
          pageNumber,
          sizeReq,
          getUserFacingStatuses(statusesReq as ResourceStatus[]),
          {
            cancelToken: source.token,
          }
        )
        .then((response) => {
          setProcessorListResponse(response.data);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            setError(err);
          }
        });
    },
    [getToken, apiBaseUrl]
  );

  return { getProcessors, processorListResponse, error };
}
