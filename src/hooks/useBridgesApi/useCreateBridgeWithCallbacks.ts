import { BridgesApi, Configuration } from "@rhoas/smart-events-management-sdk";
import { useCallback } from "react";
import { useSmartEvents } from "@contexts/SmartEventsContext";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { CreateBridgeProps } from "@app/Instance/CreateBridge/CreateBridge";

export function useCreateBridgeWithCallbacks(): {
  createBridgeAlt: CreateBridgeProps["createBridge"];
} {
  const { getToken, apiBaseUrl } = useSmartEvents();

  const createBridgeAlt = useCallback<CreateBridgeProps["createBridge"]>(
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
            case APIErrorCodes.ERROR_1:
              // setExistingInstanceName(newBridgeName);
              onError("name-taken");
              break;
            case APIErrorCodes.ERROR_33:
            case APIErrorCodes.ERROR_34:
              // When the cloud provider or region used to create a bridge
              // become unavailable, we can disable the creation form because
              // we only support 1 provider and 1 region.
              // This will of course change when we'll expand the cloud provider support.
              // setCloudProviderUnavailable(true);
              onError("region-unavailable");
              break;
          }
        } else {
          onError("generic-error");
        }
      }
    },
    [apiBaseUrl, getToken]
  );

  return { createBridgeAlt };
}
