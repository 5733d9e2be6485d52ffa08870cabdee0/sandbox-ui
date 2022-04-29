import {
  BridgesApi,
  Configuration,
  InlineResponse202,
} from "@openapi/generated";
import { useState } from "react";

export function useGetBridgesApi(
  accessToken: string,
  basePath: string
): {
  getBridges: () => Promise<void>;
  bridges?: InlineResponse202[];
  page?: number;
  size?: number;
  total?: number;
  isLoading: boolean;
  error: unknown;
} {
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [bridges, setBridges] = useState<InlineResponse202[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  const getBridges = async (): Promise<void> => {
    const bridgeApi = new BridgesApi(
      new Configuration({
        accessToken,
        basePath,
      })
    );
    await bridgeApi
      .getBridges()
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
