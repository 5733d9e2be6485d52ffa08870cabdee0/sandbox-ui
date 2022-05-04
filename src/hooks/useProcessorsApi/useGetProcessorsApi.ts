import {
  Configuration,
  ProcessorListResponse,
  ProcessorsApi,
} from "@openapi/generated";
import { useState } from "react";

export function useGetProcessorsApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  listProcessors: (
    bridgeId: string,
    pageReq?: number,
    sizeReq?: number
  ) => Promise<void>;
  processors?: ProcessorListResponse[];
  page?: number;
  size?: number;
  total?: number;
  isLoading: boolean;
  error: unknown;
} {
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [processors, setProcessors] = useState<ProcessorListResponse[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const listProcessors = async (
    bridgeId: string,
    pageReq?: number,
    sizeReq?: number
  ): Promise<void> => {
    const processorsApi = new ProcessorsApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await processorsApi
      .listProcessors(bridgeId, pageReq, sizeReq)
      .then((response) => {
        setPage(response.data.page);
        setSize(response.data.size);
        setTotal(response.data.total);
        setProcessors(response.data.items);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { listProcessors, isLoading, processors, page, size, total, error };
}
