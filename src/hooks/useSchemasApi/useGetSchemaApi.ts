import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useGetSchemaApi(): {
  getSchema: GetSchema;
} {
  const { getToken } = useSmartEvents();

  const getSchema = useCallback(
    async (schemaId: string, schemaType: "action" | "source") => {
      const retrieveToken = async (): Promise<string> => {
        return (await getToken()) || "";
      };

      const token = await retrieveToken();
      const path = schemaType === "action" ? "actions" : "sources";

      return fetch(
        `https://event-bridge-event-bridge-prod.apps.openbridge-dev.fdvn.p1.openshiftapps.com/api/v1/schemas/${path}/${schemaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => response.json());
    },
    [getToken]
  );

  return { getSchema };
}

export type GetSchema = (
  schemaId: string,
  schemaType: "source" | "action"
) => Promise<object>;
