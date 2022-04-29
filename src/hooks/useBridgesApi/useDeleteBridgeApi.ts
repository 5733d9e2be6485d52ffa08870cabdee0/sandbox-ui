import { BridgesApi, Configuration } from "@openapi/generated";
import { useState } from "react";

export function useDeleteBridgeApi(
  accessToken: string,
  basePath: string
): {
  deleteBridge: (bridgeId: string) => Promise<void>;
  isLoading: boolean;
  error: unknown;
} {
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const deleteBridge = async (bridgeId: string): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await bridgeApi
      .deleteBridge(bridgeId)
      .then()
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { deleteBridge, isLoading, error };
}
