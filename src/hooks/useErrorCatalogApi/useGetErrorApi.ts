import {
  Configuration,
  ErrorCatalogApi,
  InlineResponse2003,
} from "@openapi/generated";
import { useState } from "react";

export function useGetErrorApi(
  accessToken: string,
  basePath: string
): {
  getError: (errorId: number) => Promise<void>;
  error?: InlineResponse2003;
  // Error thrown during API call
  caughtError?: unknown;
  isLoading: boolean;
} {
  const [error, setError] = useState<InlineResponse2003>();
  const [caughtError, setCaughtError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getError = async (errorId: number): Promise<void> => {
    const errorCatalogApi = new ErrorCatalogApi(
      new Configuration({
        accessToken,
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
