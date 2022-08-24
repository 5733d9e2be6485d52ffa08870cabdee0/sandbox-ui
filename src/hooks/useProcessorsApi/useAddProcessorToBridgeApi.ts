import {
  Configuration,
  ProcessorResponse,
  ProcessorRequest,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useAddProcessorToBridgeApi(): {
  addProcessorToBridge: (
    bridgeId: string,
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

  const addProcessorToBridge = (
    bridgeId: string,
    processorRequest: ProcessorRequest
  ): void => {
    setProcessor(undefined);
    setError(undefined);
    setIsLoading(true);
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    processorsApi
      .addProcessorToBridge(bridgeId, processorRequest)
      .then((response) => setProcessor(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { addProcessorToBridge, isLoading, processor, error };
}
