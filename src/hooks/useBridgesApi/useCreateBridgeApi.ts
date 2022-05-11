import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  BridgeResponse,
} from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth } from "@rhoas/app-services-ui-shared";
import config from "../../../config/config";

export function useCreateBridgeApi(): {
  createBridge: (bridgeRequest: BridgeRequest) => void;
  bridge?: BridgeResponse;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<BridgeResponse>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const createBridge = (bridgeRequest: BridgeRequest): void => {
    setIsLoading(true);
    setBridge(undefined);
    setError(undefined);
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken: getToken,
        basePath: config.apiBasePath,
      })
    );
    bridgeApi
      .createBridge(bridgeRequest)
      .then((response) => setBridge(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { createBridge, isLoading, bridge, error };
}
