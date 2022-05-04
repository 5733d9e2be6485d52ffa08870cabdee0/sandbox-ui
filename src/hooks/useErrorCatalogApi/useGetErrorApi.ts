import {
  BridgeError,
  Configuration,
  ErrorCatalogApi,
} from "@openapi/generated";
import { useState } from "react";

export function useGetErrorApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  getError: (errorId: number) => Promise<void>;
  error?: BridgeError;
  // Error thrown during API call
  caughtError?: unknown;
  isLoading: boolean;
} {
  const [error, setError] = useState<BridgeError>();
  const [caughtError, setCaughtError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getError = async (errorId: number): Promise<void> => {
    const errorCatalogApi = new ErrorCatalogApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await errorCatalogApi
      .getError(errorId)
      .then((response) => setError(response.data))
      .catch((err) => setCaughtError(err))
      .finally(() => setIsLoading(false));
  };

  return { getError, isLoading, error, caughtError };
}
