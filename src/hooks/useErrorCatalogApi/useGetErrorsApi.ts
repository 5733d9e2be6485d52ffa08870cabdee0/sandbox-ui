import {
  Configuration,
  ErrorCatalogApi,
  ErrorResponse,
} from "@openapi/generated";
import { useState } from "react";

export function useGetErrorsApi(
  accessToken: string,
  basePath: string
): {
  getErrors: () => Promise<void>;
  errors?: ErrorResponse[];
  // Error thrown during API call
  caughtError?: unknown;
  isLoading: boolean;
} {
  const [errors, setErrors] = useState<ErrorResponse[]>();
  const [caughtError, setCaughtError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getErrors = async (): Promise<void> => {
    const errorCatalogApi = new ErrorCatalogApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await errorCatalogApi
      .getErrors()
      .then((response) => setErrors(response.data.items))
      .catch((err) => setCaughtError(err))
      .finally(() => setIsLoading(false));
  };

  return { getErrors, isLoading, errors, caughtError };
}
