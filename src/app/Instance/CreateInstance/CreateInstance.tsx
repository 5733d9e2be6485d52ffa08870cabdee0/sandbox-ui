import React, {
  FormEvent,
  useCallback,
  useLayoutEffect,
  VoidFunctionComponent,
} from "react";
import CreateInstanceMachine from "@app/Instance/CreateInstance/machines/createInstanceMachine";
import { useMachine } from "@xstate/react";
import { Form, FormSection } from "@patternfly/react-core";
import CloudProviders from "@app/Instance/CreateInstance/components/CloudProviders";
import CreateInstanceModal from "@app/Instance/CreateInstance/components/CreateInstanceModal";
import InstanceNameField from "@app/Instance/CreateInstance/components/InstanceNameField";
import { BridgeRequest } from "@rhoas/smart-events-management-sdk";
import {
  CloudProviderWithRegions,
  CreateInstanceError,
} from "@app/Instance/CreateInstance/types";
import InstanceAlert from "@app/Instance/CreateInstance/components/InstanceAlert";
import InstanceAvailableSoonInfo from "@app/Instance/CreateInstance/components/InstanceAvailableSoonInfo";

export interface CreateInstanceProps {
  /** Flag to indicate if the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback to retrieve cloud providers and regions */
  getCloudProviders: () => Promise<CloudProviderWithRegions[]>;
  /** Callback to create a bridge */
  createBridge: (
    data: BridgeRequest,
    onSuccess: () => void,
    onError: (error: CreateInstanceError) => void
  ) => void;
  /** The parent container to append the dialog to. Defaults to "document.body". */
  appendTo?: () => HTMLElement;
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
  const { getCloudProviders, onClose, createBridge, appendTo } = props;

  const [current, send] = useMachine(CreateInstanceMachine, {
    services: {
      createBridge: (context) => {
        const {
          name,
          selectedProvider: { providerId, regionId },
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
  const isNameInvalid = current.hasTag("nameInvalid") && isSubmitted;
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

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      send({ type: "create" });
    },
    [send]
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
      appendTo={appendTo}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <FormSection>
          <InstanceAlert
            isFormInvalid={isFormInvalid}
            creationError={creationError}
          />
          <InstanceNameField
            isNameInvalid={isNameInvalid}
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
        <InstanceAvailableSoonInfo />
      </Form>
    </CreateInstanceModal>
  );
};
