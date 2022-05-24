import {
  Configuration,
  ProcessorResponse,
  ProcessorsApi,
} from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";

export function useGetProcessorApi(): {
  getProcessor: (bridgeId: string, processorId: string) => void;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const config = useConfig();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.smart_events.getToken()) || "";
  }, [auth]);

  const getProcessor = useCallback(
    (bridgeId: string, processorId: string) => {
      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath: config.smart_events.apiBasePath,
        })
      );
      processorsApi
        .getProcessor(bridgeId, processorId)
        .then((response) => setProcessor(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken, config]
  );

  return { getProcessor, isLoading, processor, error };
}
