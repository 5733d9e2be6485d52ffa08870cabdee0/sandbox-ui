import React, {
  FormEvent,
  useCallback,
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
import { CreateBridgePromise } from "../../../hooks/useBridgesApi/useCreateBridgePromiseApi";

interface CreateBridgeProps {
  /** Flag to indicate if the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback to retrieve the schema used in error handling configuration */
  getSchema: GetSchema;
  /** Callback to create a bridge */
  createBridge: CreateBridgePromise;
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
  const { getSchema, onClose, createBridge } = props;

  const validateErrorHandlerParameters = useRef<(() => boolean) | undefined>();

  const [current, send] = useMachine(CreateBridgeMachine, {
    guards: {
      errorHandlerIsValid: () => {
        console.log(
          `ERROR HANDLER IS VALID: ${
            validateErrorHandlerParameters.current?.() ?? true
              ? "true"
              : "false"
          }`
        );
        return validateErrorHandlerParameters.current?.() ?? true;
      },
    },
    services: {
      createBridge: (context) => {
        const {
          name,
          selectedProvider: { providerId, regionId },
        } = context;
        console.log("SAVING THE BRIDGE!");
        return createBridge({
          name: name as string,
          cloud_provider: providerId as string,
          region: regionId as string,
          error_handler: undefined,
        });
      },
    },
    actions: {
      onCloseDialog: () => onClose(),
    },
    devTools: true,
  });

  const { name } = current.context;
  // const isFormInvalid = current.hasTag("formInvalid");
  const isSubmitted = current.hasTag("submitted");
  const isNameEmpty = current.hasTag("nameEmpty") && isSubmitted;

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
    (method: string, parameters?: Record<string, unknown>) =>
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

  const registerValidateErrorHandlerParameters = (
    callback: () => boolean
  ): void => {
    validateErrorHandlerParameters.current = callback;
  };

  // service.onTransition((state) => {
  //   if (state.changed) {
  //     console.log("PARENT MACHINE STATE CHANGE FOLLOWS");
  //     console.log(state);
  //     console.log(state.context);
  //   }
  // });
  return (
    <CreateBridgeModal onClose={onClose} formId={FORM_ID}>
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <BridgeNameField
          isNameEmpty={isNameEmpty}
          onChange={setName}
          value={name ?? ""}
        />
        <CloudProviders onChange={setProviders} />
        <ErrorHandler
          getSchema={getSchema}
          registerValidation={registerValidateErrorHandlerParameters}
          onChange={setErrorHandler}
        />
      </Form>
    </CreateBridgeModal>
  );
};
