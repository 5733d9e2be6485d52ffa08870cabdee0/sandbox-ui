import { BridgesApi, Configuration } from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { CreateInstanceProps } from "@app/Instance/CreateInstance/CreateInstance";

export function useCreateBridgeApi(): {
  createBridge: CreateInstanceProps["createBridge"];
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const createBridge = useCallback<CreateInstanceProps["createBridge"]>(
    async (data, onSuccess, onError) => {
      const bridgeApi = new BridgesApi(
        new Configuration({
          accessToken: getToken,
          basePath: apiBaseUrl,
        })
      );
      try {
        await bridgeApi.createBridge(data);
        onSuccess();
      } catch (error) {
        if (isServiceApiError(error)) {
          const errorCode = getErrorCode(error);
          switch (errorCode) {
            case APIErrorCodes.ERROR_3:
              onError("name-taken");
              break;
            case APIErrorCodes.ERROR_13:
            case APIErrorCodes.ERROR_14:
              // When the cloud provider or region used to create a bridge
              // become unavailable, we can disable the creation form because
              // we only support 1 provider and 1 region.
              // This will of course change when we'll expand the cloud provider support.
              onError("region-unavailable");
              break;
            case APIErrorCodes.ERROR_16:
              onError("quota-error");
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

  return { createBridge };
}
