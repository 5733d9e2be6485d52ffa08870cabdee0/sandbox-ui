import { useCallback, useEffect, useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import {
  Configuration,
  ProcessorSchemaEntryResponse,
  SchemaCatalogApi,
} from "@rhoas/smart-events-management-sdk";

export function useGetSchemasApi(): {
  schemas?: Array<ProcessorSchemaEntryResponse>;
  isLoading: boolean;
  error: unknown;
} {
  const [schemas, setSchemas] = useState<Array<ProcessorSchemaEntryResponse>>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, apiBaseUrl } = useSmartEvents();

  const getSchemas = useCallback(() => {
    const schemaCatalogApi = new SchemaCatalogApi(
      new Configuration({
        accessToken: getToken,
        basePath: apiBaseUrl,
      })
    );

    schemaCatalogApi
      .getCatalog()
      .then((response) => setSchemas(response.data?.items))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [getToken, apiBaseUrl]);

  useEffect(() => getSchemas(), [getSchemas]);

  return { schemas, isLoading, error };
}
