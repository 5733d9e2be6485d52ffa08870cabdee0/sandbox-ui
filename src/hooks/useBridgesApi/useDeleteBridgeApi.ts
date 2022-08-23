import { BridgesApi, Configuration } from "@rhoas/smart-events-management-sdk";
import { useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useDeleteBridgeApi(): {
  deleteBridge: (bridgeId: string) => void;
  isLoading: boolean;
  success: boolean | undefined;
  error: unknown;
} {
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>();
  const { getToken, apiBaseUrl } = useSmartEvents();

  const deleteBridge = (bridgeId: string): void => {
    setSuccess(undefined);
    setError(undefined);
    setIsLoading(true);

    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );
    bridgeApi
      .deleteBridge(bridgeId)
      .then(() => setSuccess(true))
      .catch((err) => {
        setError(err);
        setSuccess(false);
      })
      .finally(() => setIsLoading(false));
  };

  return { deleteBridge, isLoading, success, error };
}
