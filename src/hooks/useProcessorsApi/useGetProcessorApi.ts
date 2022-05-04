import {
  Configuration,
  ProcessorResponse,
  ProcessorsApi,
} from "@openapi/generated";
import { useCallback, useState } from "react";

export function useGetProcessorApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  getProcessor: (bridgeId: string, processorId: string) => Promise<void>;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getProcessor = useCallback(
    async (bridgeId: string, processorId: string): Promise<void> => {
      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath,
        })
      );
      await processorsApi
        .getProcessor(bridgeId, processorId)
        .then((response) => setProcessor(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken, basePath]
  );

  return { getProcessor, isLoading, processor, error };
}
