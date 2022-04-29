import {
  Configuration,
  InlineResponse2021,
  ProcessorRequest,
  ProcessorsApi,
} from "@openapi/generated";
import { useState } from "react";

export function useAddProcessorToBridgeApi(
  accessToken: string,
  basePath: string
): {
  addProcessorToBridge: (
    bridgeId: string,
    processorRequest: ProcessorRequest
  ) => Promise<void>;
  processor?: InlineResponse2021;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<InlineResponse2021>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const addProcessorToBridge = async (
    bridgeId: string,
    processorRequest: ProcessorRequest
  ): Promise<void> => {
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken,
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
