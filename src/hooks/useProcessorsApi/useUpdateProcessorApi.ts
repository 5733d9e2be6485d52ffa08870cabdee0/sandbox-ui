import {
  Configuration,
  InlineResponse2021,
  ProcessorRequest,
  ProcessorsApi,
} from "@openapi/generated";
import { useState } from "react";

export function useUpdateProcessorApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  updateProcessor: (
    bridgeId: string,
    processorId: string,
    processorRequest: ProcessorRequest
  ) => Promise<void>;
  processor?: InlineResponse2021;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<InlineResponse2021>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const updateProcessor = async (
    bridgeId: string,
    processorId: string,
    processorRequest: ProcessorRequest
  ): Promise<void> => {
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await processorsApi
      .updateProcessor(bridgeId, processorId, processorRequest)
      .then((response) => setProcessor(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { updateProcessor, isLoading, processor, error };
}
