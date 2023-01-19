import {
  Configuration,
  ProcessorRequest,
  ProcessorsApi,
} from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import { CreateProcessorError } from "@app/components/POCs/ProcessorEdit/ProcessorMachine";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";

export interface CreateProcessor {
  (
    bridgeId: string,
    data: ProcessorRequest,
    onSuccess: () => void,
    onError: (error: CreateProcessorError) => void
  ): void;
}

export function useCreateProcessorApi(): {
  createProcessor: CreateProcessor;
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const createProcessor = useCallback<CreateProcessor>(
    async (bridgeId, data, onSuccess, onError) => {
      const processorsApi = new ProcessorsApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      try {
        await processorsApi.createProcessor(bridgeId, data);
        onSuccess();
      } catch (error) {
        if (isServiceApiError(error)) {
          const errorCode = getErrorCode(error);
          switch (errorCode) {
            case APIErrorCodes.ERROR_3:
              onError("name-taken");
              break;
            default:
              onError("generic-error");
          }
        } else {
          onError("generic-error");
        }
      }
    },
    [apiBaseUrl, getToken]
  );

  return { createProcessor };
}
