import {
  Configuration,
  ErrorCatalogApi,
  ErrorResponse,
} from "@openapi/generated";
import { useState } from "react";

export function useGetErrorsApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  getErrors: () => Promise<void>;
  errors?: ErrorResponse[];
  page?: number;
  size?: number;
  total?: number;
  // Error thrown during API call
  caughtError?: unknown;
  isLoading: boolean;
} {
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [errors, setErrors] = useState<ErrorResponse[]>();
  const [caughtError, setCaughtError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getErrors = async (): Promise<void> => {
    const errorCatalogApi = new ErrorCatalogApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await errorCatalogApi
      .getErrors()
      .then((response) => {
        setPage(response.data.page);
        setSize(response.data.size);
        setTotal(response.data.total);
        setErrors(response.data.items);
      })
      .catch((err) => setCaughtError(err))
      .finally(() => setIsLoading(false));
  };

  return { getErrors, isLoading, errors, page, size, total, caughtError };
}
