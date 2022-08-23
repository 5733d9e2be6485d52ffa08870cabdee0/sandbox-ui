import { useCallback, useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import {
  Configuration,
  SchemaCatalogApi,
} from "@rhoas/smart-events-management-sdk";
import { ProcessorSchemaType } from "../../types/Processor";

export function useGetSchemaApi(): {
  getSchema: GetSchema;
  error: unknown;
} {
  const { getToken, apiBaseUrl } = useSmartEvents();
  const [error, setError] = useState<unknown>();

  const getSchema = useCallback(
    (schemaId: string, schemaType: ProcessorSchemaType) => {
      const schemaCatalogApi = new SchemaCatalogApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );

      return schemaType === ProcessorSchemaType.ACTION
        ? schemaCatalogApi
            .getActionProcessorSchema(schemaId)
            .then((response) => response.data)
            .catch((err) => {
              setError(err);
              throw err;
            })
        : schemaCatalogApi
            .getSourceProcessorSchema(schemaId)
            .then((response) => response.data)
            .catch((err) => {
              setError(err);
              throw err;
            });
    },
    [getToken, apiBaseUrl]
  );

  return { getSchema, error };
}

export type GetSchema = (
  schemaId: string,
  schemaType: ProcessorSchemaType
) => Promise<object>;
