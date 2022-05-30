import {
  Configuration,
  ProcessorResponse,
  ProcessorRequest,
  ProcessorsApi,
} from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";

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
  const auth = useAuth();
  const config = useConfig();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.smart_events.getToken()) || "";
  }, [auth]);

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
        basePath: config.smart_events.apiBasePath,
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
