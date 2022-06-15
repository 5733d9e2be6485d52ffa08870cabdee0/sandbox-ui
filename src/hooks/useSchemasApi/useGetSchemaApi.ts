import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import { Configuration, SchemaCatalogApi } from "@openapi/generated";
import { ProcessorSchemaType } from "../../types/Processor";

export function useGetSchemaApi(): {
  getSchema: GetSchema;
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

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
        : schemaCatalogApi
            .getSourceProcessorSchema(schemaId)
            .then((response) => response.data);
    },
    [getToken, apiBaseUrl]
  );

  return { getSchema };
}

export type GetSchema = (
  schemaId: string,
  schemaType: ProcessorSchemaType
) => Promise<object>;
