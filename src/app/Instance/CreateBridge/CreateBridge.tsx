import React, {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  VoidFunctionComponent,
} from "react";
import CreateBridgeMachine from "@app/Instance/CreateBridge/machines/createBridgeMachine";
import { useMachine } from "@xstate/react";
import { Form } from "@patternfly/react-core";
import CloudProviders from "@app/Instance/CreateBridge/components/CloudProviders";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import ErrorHandler from "@app/Instance/CreateBridge/components/ErrorHandler";
import CreateBridgeModal from "@app/Instance/CreateBridge/components/CreateBridgeModal";
import BridgeNameField from "@app/Instance/CreateBridge/components/BridgeNameField";
import { BridgeRequest } from "@rhoas/smart-events-management-sdk";
import {
  CloudProviderWithRegions,
  CreateBridgeError,
} from "@app/Instance/CreateBridge/types";
import BridgeAlert from "@app/Instance/CreateBridge/components/BridgeAlert";

export interface CreateBridgeProps {
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
    onError: (error: CreateBridgeError) => void
  ) => void;
}

const FORM_ID = "create-instance-form";

const CreateBridge: VoidFunctionComponent<CreateBridgeProps> = (props) => {
  const { isOpen, ...rest } = props;

  return <>{isOpen && <CreatBridgeDialog {...rest} />}</>;
};

export default CreateBridge;

type CreateBridgeDialogProps = Omit<CreateBridgeProps, "isOpen">;

const CreatBridgeDialog: VoidFunctionComponent<CreateBridgeDialogProps> = (
  props
) => {
  const { getSchema, getCloudProviders, onClose, createBridge } = props;

  const validateErrorHandlerParameters = useRef<(() => boolean) | undefined>();

  const [current, send] = useMachine(CreateBridgeMachine, {
    guards: {
      errorHandlerIsValid: () => {
        // console.log(
        //   `ERROR HANDLER IS VALID: ${
        //     validateErrorHandlerParameters.current?.() ?? true
        //       ? "true"
        //       : "false"
        //   }`
        // );
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
          function onError(error: CreateBridgeError): void {
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
      const firstError = document.querySelector(".pf-m-error");
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
    (error: CreateBridgeError) => {
      send({ type: "providersAvailabilityError", error });
    },
    [send]
  );

  // service.onTransition((state) => {
  //   if (state.changed) {
  //     console.log("PARENT MACHINE STATE CHANGE FOLLOWS");
  //     console.log(state);
  //     console.log(state.context);
  //   }
  // });
  return (
    <CreateBridgeModal
      onClose={onClose}
      formId={FORM_ID}
      isSaving={isSaving}
      isDisabled={isDisabled}
      isLoading={isSaving}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <BridgeAlert
          isFormInvalid={isFormInvalid}
          creationError={creationError}
        />
        <BridgeNameField
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
        <ErrorHandler
          getSchema={getSchema}
          registerValidation={registerValidateErrorHandlerParameters}
          onChange={setErrorHandler}
          isDisabled={isDisabled}
        />
      </Form>
    </CreateBridgeModal>
  );
};
