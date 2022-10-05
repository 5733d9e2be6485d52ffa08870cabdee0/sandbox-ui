import React, {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  VoidFunctionComponent,
} from "react";
import CreateInstanceMachine from "@app/Instance/CreateInstance/machines/createInstanceMachine";
import { useMachine } from "@xstate/react";
import { Form, FormSection } from "@patternfly/react-core";
import CloudProviders from "@app/Instance/CreateInstance/components/CloudProviders";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import CreateInstanceModal from "@app/Instance/CreateInstance/components/CreateInstanceModal";
import InstanceNameField from "@app/Instance/CreateInstance/components/InstanceNameField";
import { BridgeRequest } from "@rhoas/smart-events-management-sdk";
import {
  CloudProviderWithRegions,
  CreateInstanceError,
} from "@app/Instance/CreateInstance/types";
import InstanceAlert from "@app/Instance/CreateInstance/components/InstanceAlert";
import InstanceAvailableSoonInfo from "@app/Instance/CreateInstance/components/InstanceAvailableSoonInfo";
import ErrorHandlingCreate from "@app/Instance/ErrorHandling/ErrorHandlingCreate";
import { useTranslation } from "@rhoas/app-services-ui-components";

export interface CreateInstanceProps {
  /** Flag to indicate if the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback to retrieve the schema used in error handling configuration */
  getSchema: GetSchema;
  /** Callback to retrieve cloud providers and regions */
  getCloudProviders: () => Promise<CloudProviderWithRegions[]>;
  /** Callback to create a bridge */
  createBridge: (
    data: BridgeRequest,
    onSuccess: () => void,
    onError: (error: CreateInstanceError) => void
  ) => void;
}

const FORM_ID = "create-instance-form";

const CreateInstance: VoidFunctionComponent<CreateInstanceProps> = (props) => {
  const { isOpen, ...rest } = props;

  return <>{isOpen && <CreatBridgeDialog {...rest} />}</>;
};

export default CreateInstance;

type CreateInstanceDialogProps = Omit<CreateInstanceProps, "isOpen">;

const CreatBridgeDialog: VoidFunctionComponent<CreateInstanceDialogProps> = (
  props
) => {
  const { getSchema, getCloudProviders, onClose, createBridge } = props;

  const { t } = useTranslation("openbridgeTempDictionary");

  const validateErrorHandlerParameters = useRef<(() => boolean) | undefined>();

  const [current, send] = useMachine(CreateInstanceMachine, {
    guards: {
      errorHandlerIsValid: () => {
        return validateErrorHandlerParameters.current?.() ?? true;
      },
    },
    services: {
      createBridge: (context) => {
        const {
          name,
          selectedProvider: { providerId, regionId },
          errorHandler: { method, parameters },
        } = context;
        return (send) => {
          function onSuccess(): void {
            send("createSuccess");
          }
          function onError(error: CreateInstanceError): void {
            send({ type: "createError", error });
          }
          createBridge(
            {
              name: name as string,
              cloud_provider: providerId as string,
              region: regionId as string,
              ...(method !== undefined && parameters !== undefined
                ? { error_handler: { type: method, parameters } }
                : {}),
            },
            onSuccess,
            onError
          );
        };
      },
    },
    devTools: true,
  });

  const { name, creationError } = current.context;
  const isSubmitted = current.hasTag("submitted");
  const isFormInvalid = current.hasTag("formInvalid") && isSubmitted;
  const isNameEmpty = current.hasTag("nameEmpty") && isSubmitted;
  const isNameTaken = creationError === "name-taken";
  const isSaving = current.matches("configuring.form.saving");
  const isDisabled = current.hasTag("creationUnavailable") || isSaving;

  useLayoutEffect(() => {
    if (isFormInvalid) {
      const firstError = document.querySelector(
        ".instance-field-error, .pf-m-error"
      );
      const alert = document.querySelector(".create-bridge-error");
      (firstError ?? alert)?.scrollIntoView({
        behavior: "smooth",
        block: firstError ? "start" : "end",
      });
    }
  }, [isFormInvalid]);

  const setName = useCallback(
    (name: string) => send({ type: "nameChange", name }),
    [send]
  );

  const setProviders = useCallback(
    (providerId?: string, regionId?: string) =>
      send({ type: "providerChange", providerId, regionId }),
    [send]
  );

  const setErrorHandler = useCallback(
    (method?: string, parameters?: Record<string, unknown>) =>
      send({ type: "errorHandlerChange", method, parameters }),
    [send]
  );

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      send({ type: "create" });
    },
    [send]
  );

  const registerValidateErrorHandlerParameters = useCallback(
    (callback: () => boolean): void => {
      validateErrorHandlerParameters.current = callback;
    },
    []
  );

  const onProviderError = useCallback(
    (error: CreateInstanceError) => {
      send({ type: "providersAvailabilityError", error });
    },
    [send]
  );

  return (
    <CreateInstanceModal
      onClose={onClose}
      formId={FORM_ID}
      isSaving={isSaving}
      isDisabled={isDisabled}
      isLoading={isSaving}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <FormSection>
          <InstanceAlert
            isFormInvalid={isFormInvalid}
            creationError={creationError}
          />
          <InstanceNameField
            isNameEmpty={isNameEmpty}
            isNameTaken={isNameTaken}
            onChange={setName}
            value={name ?? ""}
            isDisabled={isDisabled}
          />
          <CloudProviders
            getCloudProviders={getCloudProviders}
            onChange={setProviders}
            isDisabled={isDisabled}
            onProviderError={onProviderError}
          />
        </FormSection>
        <FormSection title={t("common.errorHandling")} titleElement="h3">
          <ErrorHandlingCreate
            getSchema={getSchema}
            registerValidation={registerValidateErrorHandlerParameters}
            onChange={setErrorHandler}
            isDisabled={isDisabled}
          />
        </FormSection>
        <InstanceAvailableSoonInfo />
      </Form>
    </CreateInstanceModal>
  );
};
