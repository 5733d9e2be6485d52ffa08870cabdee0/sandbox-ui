import { useCallback, useState } from "react";
import {
  Configuration,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useCanIDeleteBridge(): {
  canIDeleteBridge: (bridgeId: string) => Promise<boolean>;
  error: unknown;
} {
  const [error, setError] = useState<unknown>();
  const { getToken, apiBaseUrl } = useSmartEvents();

  const canIDeleteBridge = useCallback(
    (bridgeId: string) => {
      setError(undefined);
      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      return processorsApi
        .listProcessors(bridgeId, undefined, 0, 1)
        .then((response) => {
          return response.data?.total === 0;
        })
        .catch((err) => {
          setError(err);
          return false;
        });
    },
    [apiBaseUrl, getToken]
  );

  return { error, canIDeleteBridge };
}
