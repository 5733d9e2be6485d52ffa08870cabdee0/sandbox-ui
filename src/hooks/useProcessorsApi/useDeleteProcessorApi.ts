import { Configuration, ProcessorsApi } from "@openapi/generated";
import { useState } from "react";

export function useDeleteProcessorApi(
  accessToken: string,
  basePath: string
): {
  deleteProcessor: (bridgeId: string, processorId: string) => Promise<void>;
  isLoading: boolean;
  error: unknown;
} {
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const deleteProcessor = async (
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
      .deleteProcessor(bridgeId, processorId)
      .then()
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { deleteProcessor, isLoading, error };
}
