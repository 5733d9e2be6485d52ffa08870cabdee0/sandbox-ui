import {
  Configuration,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useDeleteProcessorApi(): {
  deleteProcessor: (bridgeId: string, processorId: string) => void;
  isLoading: boolean;
  success: boolean | undefined;
  error: unknown;
} {
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();
  const { getToken, apiBaseUrl } = useSmartEvents();

  const deleteProcessor = (bridgeId: string, processorId: string): void => {
    setSuccess(undefined);
    setError(undefined);
    setIsLoading(true);

    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    processorsApi
      .deleteProcessor(bridgeId, processorId)
      .then(() => setSuccess(true))
      .catch((err) => {
        setError(err);
        setSuccess(false);
      })
      .finally(() => setIsLoading(false));
  };

  return { deleteProcessor, isLoading, success, error };
}
