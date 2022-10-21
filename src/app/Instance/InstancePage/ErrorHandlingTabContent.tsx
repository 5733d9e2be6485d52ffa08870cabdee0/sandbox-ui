import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { useGetSchemaApi } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import { ProcessorSchemaType } from "../../../types/Processor";
import {
  BridgeRequest,
  BridgeResponse,
  ManagedResourceStatus,
} from "@rhoas/smart-events-management-sdk";
import { ErrorHandlingDetail } from "@app/Instance/ErrorHandling/ErrorHandlingDetail";
import { ErrorHandlingEdit } from "@app/Instance/ErrorHandling/ErrorHandlingEdit";
import { useUpdateBridgeApi } from "../../../hooks/useBridgesApi/useUpdateBridgeApi";
import isEqualWith from "lodash.isequalwith";
import isEqual from "lodash.isequal";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { useHistory } from "react-router-dom";
import ErrorHandlingPageSection from "@app/Instance/ErrorHandling/ErrorHandlingPageSection";
import { getErrorHandlingMethodByType } from "../../../types/ErrorHandlingMethods";

interface ErrorHandlingTabContentProps {
  bridge?: BridgeResponse;
  isBridgeLoading: boolean;
}

export const ErrorHandlingTabContent = ({
  bridge,
  isBridgeLoading,
}: ErrorHandlingTabContentProps): JSX.Element => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const history = useHistory();

  const validateParameters = useRef<(() => boolean) | undefined>();
  const registerValidateParameters = (callback: () => boolean): void => {
    validateParameters.current = callback;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [currentSchema, setCurrentSchema] = useState<object>();
  const [isSchemaLoading, setIsSchemaLoading] = useState(false);
  const [apiError, setApiError] = useState<string>();

  const {
    error: updateBridgeError,
    isLoading: isUpdateBridgeLoading,
    updateBridge,
  } = useUpdateBridgeApi();

  const { getSchema, error: schemaError } = useGetSchemaApi();

  const onCancelEditing = useCallback(() => {
    setApiError(undefined);
    setIsEditing(false);
    setIsSchemaLoading(false);
  }, []);

  const bridgeNotChanged = useCallback(
    (prevDef: BridgeResponse, updatedDef: BridgeResponse): boolean =>
      isEqualWith(
        prevDef,
        updatedDef,
        (prev: BridgeResponse, next: BridgeResponse) =>
          isEqual(prev.error_handler?.type, next.error_handler?.type) &&
          isEqual(
            prev.error_handler?.parameters,
            next.error_handler?.parameters
          )
      ),
    []
  );

  const onErrorHandlingSubmit = useCallback(
    (errorHandlingMethod?: string, errorHandlingParameters?: object) => {
      setApiError(undefined);
      if (bridge && validateParameters.current?.()) {
        const updatedBridge = {
          ...bridge,
          ...(errorHandlingMethod
            ? {
                error_handler: {
                  type: errorHandlingMethod,
                  parameters: errorHandlingParameters,
                },
              }
            : {
                error_handler: undefined,
              }),
        } as BridgeResponse;

        if (bridgeNotChanged(bridge, updatedBridge)) {
          onCancelEditing();
          return;
        }

        void updateBridge(bridge.id, updatedBridge as BridgeRequest).then(
          () => {
            history.replace("/");
          }
        );
      }
    },
    [bridge, bridgeNotChanged, history, onCancelEditing, updateBridge]
  );

  const getSchemaByMethod = useCallback(
    (method: string) => {
      setApiError(undefined);
      return getSchema(method, ProcessorSchemaType.ACTION).then((data) => data);
    },
    [getSchema]
  );

  useEffect(() => {
    if (updateBridgeError) {
      if (
        isServiceApiError(updateBridgeError) &&
        getErrorCode(updateBridgeError) === APIErrorCodes.ERROR_2
      ) {
        setApiError(t("instance.errors.cantUpdateInstanceNotActionableState"));
      } else {
        setApiError(t("instance.errors.cantUpdateInstanceGenericError"));
      }
    }
  }, [updateBridgeError, t]);

  useEffect(() => {
    if (schemaError && isServiceApiError(schemaError)) {
      if (getErrorCode(schemaError) === APIErrorCodes.ERROR_4) {
        setApiError(t("errorHandling.errors.cantFindSchema"));
      } else {
        setApiError(t("errorHandling.errors.schemaGenericError"));
      }
    }
  }, [schemaError, t]);

  useEffect(() => {
    if (
      bridge?.error_handler?.type &&
      getErrorHandlingMethodByType(bridge?.error_handler?.type).hasSchema
    ) {
      setIsSchemaLoading(true);
      setCurrentSchema(undefined);
      getSchemaByMethod(bridge.error_handler.type)
        .then((data) => setCurrentSchema(data))
        .finally(() => setIsSchemaLoading(false));
    }
  }, [bridge?.error_handler?.type, getSchemaByMethod, t]);

  const editIsDisabled =
    !(
      bridge?.status === ManagedResourceStatus.Ready ||
      bridge?.status === ManagedResourceStatus.Failed
    ) ||
    isBridgeLoading ||
    isSchemaLoading ||
    isUpdateBridgeLoading ||
    apiError !== undefined;

  return (
    <ErrorHandlingPageSection>
      {isEditing ? (
        <ErrorHandlingEdit
          getSchema={getSchemaByMethod}
          isLoading={isUpdateBridgeLoading || isSchemaLoading}
          method={bridge?.error_handler?.type}
          onCancelEditing={onCancelEditing}
          onSubmit={onErrorHandlingSubmit}
          parameters={
            bridge?.error_handler?.parameters as Record<string, unknown>
          }
          registerValidateParameters={registerValidateParameters}
          apiError={apiError}
        />
      ) : (
        <ErrorHandlingDetail
          errorHandlingType={bridge?.error_handler?.type}
          errorHandlingParameters={bridge?.error_handler?.parameters}
          isBridgeLoading={isBridgeLoading}
          isSchemaLoading={isSchemaLoading}
          schema={currentSchema}
          apiError={apiError}
          onEdit={(): void => setIsEditing(true)}
          isEditDisabled={editIsDisabled}
        />
      )}
    </ErrorHandlingPageSection>
  );
};
