import React, {
  FormEvent,
  useCallback,
  useRef,
  VoidFunctionComponent,
} from "react";
import CreateBridgeMachine from "@app/Instance/CreateBridge/machines/createBridgeMachine";
import { useMachine } from "@xstate/react";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import CloudProviders from "@app/Instance/CreateBridge/components/CloudProviders";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import ErrorHandler from "@app/Instance/CreateBridge/components/ErrorHandler";

interface CreateBridgeProps {
  /** Flag to indicate if the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback to retrieve the schema used in error handling configuration */
  getSchema: GetSchema;
}

const FORM_ID = "create-instance-form";

const CreateBridge: VoidFunctionComponent<CreateBridgeProps> = (props) => {
  const { isOpen, onClose, getSchema } = props;

  return (
    <>
      {isOpen && <CreatBridgeDialog onClose={onClose} getSchema={getSchema} />}
    </>
  );
};

export default CreateBridge;

type CreateBridgeDialogProps = Omit<CreateBridgeProps, "isOpen">;

const CreatBridgeDialog: VoidFunctionComponent<CreateBridgeDialogProps> = (
  props
) => {
  const { getSchema, onClose } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const validateErrorHandlerParameters = useRef<(() => boolean) | undefined>();

  const [current, send] = useMachine(CreateBridgeMachine, {
    guards: {
      errorHandlerIsValid: () =>
        validateErrorHandlerParameters.current?.() ?? true,
    },
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
    <Modal
      position="top"
      isOpen={true}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance"
      width={640}
      onClose={onClose}
      actions={[
        <Button
          key="submit"
          ouiaId="submit"
          variant="primary"
          type="submit"
          form={FORM_ID}
          // isDisabled={formIsDisabled}
          spinnerAriaValueText={t("common.submittingRequest")}
          // isLoading={isLoading}
        >
          {t("instance.createSEInstance")}
        </Button>,
        <Button key="cancel" ouiaId="cancel" variant="link" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <h1>{current.context.info}</h1>
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <FormGroup
          label={t("common.name")}
          isRequired
          fieldId="instance-name"
          validated={isNameEmpty ? "error" : "default"}
          helperTextInvalid={t("common.required")}
        >
          <TextInput
            isRequired
            ouiaId="new-name"
            type="text"
            maxLength={255}
            id="instance-name"
            name="instance-name"
            value={name}
            onChange={setName}
            // onBlur={validate}
            validated={isNameEmpty ? "error" : "default"}
            // isDisabled={formIsDisabled}
          />
        </FormGroup>
        <CloudProviders onChange={setProviders} />
        <ErrorHandler
          getSchema={getSchema}
          registerValidation={registerValidateErrorHandlerParameters}
          onChange={setErrorHandler}
        />
      </Form>
    </Modal>
  );
};
