import React, { FormEvent, useCallback, VoidFunctionComponent } from "react";
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

interface CreateBridgeProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORM_ID = "create-instance-form";

const CreateBridge: VoidFunctionComponent<CreateBridgeProps> = (props) => {
  const { isOpen, onClose } = props;

  return <>{isOpen && <CreatBridgeDialog onClose={onClose} />}</>;
};

export default CreateBridge;

interface CreateBridgeDialogProps {
  onClose: () => void;
}

const CreatBridgeDialog: VoidFunctionComponent<CreateBridgeDialogProps> = ({
  onClose,
}) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const [current, send] = useMachine(CreateBridgeMachine);

  const { name } = current.context;
  // const isFormInvalid = current.hasTag("formInvalid");
  const isSubmitted = current.hasTag("submitted");
  const isNameEmpty = current.hasTag("nameEmpty") && isSubmitted;
  const setName = useCallback(
    (name: string) => send({ type: "nameChange", name }),
    [send]
  );

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      send({ type: "create" });
    },
    [send]
  );

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
          helperTextInvalid={"name error"}
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
        <CloudProviders />
      </Form>
    </Modal>
  );
};
