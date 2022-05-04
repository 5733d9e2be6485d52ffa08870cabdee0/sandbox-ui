import {
  Configuration,
  ProcessorResponse,
  ProcessorRequest,
  ProcessorsApi,
} from "@openapi/generated";
import { useState } from "react";

export function useAddProcessorToBridgeApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  addProcessorToBridge: (
    bridgeId: string,
    processorRequest: ProcessorRequest
  ) => Promise<void>;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const addProcessorToBridge = async (
    bridgeId: string,
    processorRequest: ProcessorRequest
  ): Promise<void> => {
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await processorsApi
      .addProcessorToBridge(bridgeId, processorRequest)
      .then((response) => setProcessor(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { addProcessorToBridge, isLoading, processor, error };
}
