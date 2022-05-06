import { BridgesApi, Configuration, BridgeResponse } from "@openapi/generated";
import { useCallback, useState } from "react";
import { useAuth } from "@rhoas/app-services-ui-shared";
import config from "config/config";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
} from "@app/components/TableWithPagination/TableWithPagination";

export function useGetBridgesApi(): {
  getBridges: (
    pageReq?: number,
    sizeReq?: number
  ) => Promise<void | { page: number; size: number; total: number }>;
  bridges?: BridgeResponse[];
  isLoading: boolean;
  error: unknown;
} {
  const [bridges, setBridges] = useState<BridgeResponse[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  const getToken = useCallback(async (): Promise<string> => {
    return (await auth.kas.getToken()) || "";
  }, [auth]);

  const getBridges = useCallback(
    (
      pageReq?: number,
      sizeReq?: number
    ): Promise<void | { page: number; size: number; total: number }> => {
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: config.apiBasePath,
        })
      );
      return bridgeApi
        .getBridges(pageReq, sizeReq)
        .then((response) => {
          const data = response.data;
          setBridges(data.items);
          return {
            page: data.page ?? FIRST_PAGE,
            size: data.size ?? DEFAULT_PAGE_SIZE,
            total: data.total ?? 0,
          };
        })
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [getToken]
  );

  return { getBridges, isLoading, bridges, error };
}
