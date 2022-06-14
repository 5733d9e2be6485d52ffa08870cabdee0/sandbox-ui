import { useCallback, useEffect, useState } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";

export function useGetSchemasApi(): {
  schemas?: Schema[];
  sourceSchemas?: Schema[];
  actionSchemas?: Schema[];
  isLoading: boolean;
  error: unknown;
} {
  const [schemas, setSchemas] = useState<Schema[]>();
  const [sourceSchemas, setSourceSchemas] = useState<Schema[]>();
  const [actionSchemas, setActionSchemas] = useState<Schema[]>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useSmartEvents();

  const getSchemas = useCallback(async () => {
    const retrieveToken = async (): Promise<string> => {
      return (await getToken()) || "";
    };

    const token = await retrieveToken();

    fetch(
      "https://event-bridge-event-bridge-prod.apps.openbridge-dev.fdvn.p1.openshiftapps.com/api/v1/schemas",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      .then((response) => setSchemas(response.items))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [getToken]);

  useEffect(() => void getSchemas(), [getSchemas]);

  useEffect(() => {
    if (schemas) {
      setSourceSchemas(schemas.filter((schema) => schema.type === "source"));
      setActionSchemas(schemas.filter((schema) => schema.type === "action"));
    }
  }, [schemas]);

  return { schemas, sourceSchemas, actionSchemas, isLoading, error };
}

export interface Schema {
  kind: string;
  id: string;
  name: string;
  description: string;
  type: "action" | "source";
  href: string;
}

export interface Schemas {
  king: "string";
  items: Schema[];
}
