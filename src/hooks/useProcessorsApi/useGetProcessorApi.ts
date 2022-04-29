import {
  Configuration,
  InlineResponse2021,
  ProcessorsApi,
} from "@openapi/generated";
import { useState } from "react";

export function useGetProcessorApi(
  accessToken: string,
  basePath: string
): {
  getProcessor: (bridgeId: string, processorId: string) => Promise<void>;
  processor?: InlineResponse2021;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<InlineResponse2021>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getProcessor = async (
    bridgeId: string,
    processorId: string
  ): Promise<void> => {
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await processorsApi
      .getProcessor(bridgeId, processorId)
      .then((response) => setProcessor(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { getProcessor, isLoading, processor, error };
}
