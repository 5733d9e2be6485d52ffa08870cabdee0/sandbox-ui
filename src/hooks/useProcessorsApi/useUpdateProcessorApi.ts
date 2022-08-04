import {
  Configuration,
  ProcessorResponse,
  ProcessorRequest,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useUpdateProcessorApi(): {
  updateProcessor: (
    bridgeId: string,
    processorId: string,
    processorRequest: ProcessorRequest
  ) => void;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const { getToken, apiBaseUrl } = useSmartEvents();

  const updateProcessor = (
    bridgeId: string,
    processorId: string,
    processorRequest: ProcessorRequest
  ): void => {
    setIsLoading(true);
    setError(undefined);
    setProcessor(undefined);
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    processorsApi
      .updateProcessor(bridgeId, processorId, processorRequest)
      .then((response) => setProcessor(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { updateProcessor, isLoading, processor, error };
}
