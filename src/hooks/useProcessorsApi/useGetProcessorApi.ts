import {
  Configuration,
  ProcessorResponse,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useCallback, useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useGetProcessorApi(): {
  getProcessor: (bridgeId: string, processorId: string) => void;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getProcessor = useCallback(
    (bridgeId: string, processorId: string) => {
      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      processorsApi
        .getProcessor(bridgeId, processorId)
        .then((response) => setProcessor(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken, apiBaseUrl]
  );

  return { getProcessor, isLoading, processor, error };
}
