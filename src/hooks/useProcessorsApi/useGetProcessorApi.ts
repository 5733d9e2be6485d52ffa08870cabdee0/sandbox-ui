import {
  Configuration,
  ProcessorResponse,
  ProcessorsApi,
} from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth } from "@rhoas/app-services-ui-shared";
import config from "../../../config/config";

export function useGetProcessorApi(): {
  getProcessor: (bridgeId: string, processorId: string) => void;
  processor?: ProcessorResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [processor, setProcessor] = useState<ProcessorResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const getProcessor = useCallback(
    (bridgeId: string, processorId: string) => {
      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath: config.apiBasePath,
        })
      );
      processorsApi
        .getProcessor(bridgeId, processorId)
        .then((response) => setProcessor(response.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken]
  );

  return { getProcessor, isLoading, processor, error };
}
