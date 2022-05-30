import {
  Configuration,
  ProcessorListResponse,
  ProcessorsApi,
} from "@openapi/generated";
import { useCallback, useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";

export function useGetProcessorsApi(): {
  getProcessors: (
    bridgeId: string,
    pageReq?: number,
    sizeReq?: number,
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
  const auth = useAuth();
  const config = useConfig();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.smart_events.getToken()) || "";
  }, [auth]);

  const getProcessors = useCallback(
    (
      bridgeId: string,
      pageReq?: number,
      sizeReq?: number,
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
          basePath: config.smart_events.apiBasePath,
        })
      );
      processorsApi
        .listProcessors(bridgeId, pageReq, sizeReq, {
          cancelToken: source.token,
        })
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
    [getToken, config]
  );

  return { getProcessors, isLoading, processorListResponse, error };
}
