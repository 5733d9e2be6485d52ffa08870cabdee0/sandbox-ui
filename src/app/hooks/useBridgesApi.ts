import {
  BridgeRequest,
  BridgesApi,
  Configuration,
  InlineResponse202,
} from "../../../openapi/generated";
import { useEffect, useState } from "react";

interface BridgeApiBaseProps {
  accessToken: () => Promise<string>;
  basePath: string;
}

interface BridgeApiCreationProps extends BridgeApiBaseProps {
  bridgeRequest: BridgeRequest;
}

export function useCreateBridgeApi(
  bridgeApiCreationProps: BridgeApiCreationProps
): {
  bridge?: InlineResponse202;
  isLoading: boolean;
  error: unknown;
} {
  const [bridge, setBridge] = useState<InlineResponse202>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void createBridge(bridgeApiCreationProps);
  }, [bridgeApiCreationProps]);

  const createBridge = async ({
    accessToken,
    basePath,
    bridgeRequest,
  }: BridgeApiCreationProps): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await bridgeApi
      .createBridge(bridgeRequest)
      .then((response) => setBridge(response.data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { isLoading, bridge, error };
}
