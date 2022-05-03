import {
  BridgesApi,
  Configuration,
  InlineResponse200,
} from "@openapi/generated";
import { useState } from "react";

export function useGetBridgesApi(
  getToken: () => Promise<string>,
  basePath: string
): {
  getBridges: (pageReq?: number, sizeReq?: number) => Promise<void>;
  bridges?: InlineResponse200[];
  page?: number;
  size?: number;
  total?: number;
  isLoading: boolean;
  error: unknown;
} {
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [bridges, setBridges] = useState<InlineResponse200[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getBridges = async (
    pageReq?: number,
    sizeReq?: number
  ): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken: getToken,
        basePath,
      })
    );
    await bridgeApi
      .getBridges(pageReq, sizeReq)
      .then((response) => {
        setPage(response.data.page);
        setSize(response.data.size);
        setTotal(response.data.total);
        setBridges(response.data.items);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { getBridges, isLoading, bridges, page, size, total, error };
}
