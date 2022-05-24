import { Configuration, ProcessorsApi } from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth, useConfig } from "@rhoas/app-services-ui-shared";

export function useDeleteProcessorApi(): {
  deleteProcessor: (bridgeId: string, processorId: string) => void;
  isLoading: boolean;
  success: boolean | undefined;
  error: unknown;
} {
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();
  const auth = useAuth();
  const config = useConfig();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.smart_events.getToken()) || "";
  }, [auth]);

  const deleteProcessor = (bridgeId: string, processorId: string): void => {
    setSuccess(undefined);
    setError(undefined);
    setIsLoading(true);

    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath: config.smart_events.apiBasePath,
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
