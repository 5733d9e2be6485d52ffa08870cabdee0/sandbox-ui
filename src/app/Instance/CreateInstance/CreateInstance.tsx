import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Alert,
  AlertGroup,
  Button,
  Form,
  FormGroup,
  Modal,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

export interface CreateInstanceProps {
  /**
   * Flag to indicate the creation request is in progress
   */
  isLoading: boolean;
  /**
   * Flag to show/hide the modal
   */
  isModalOpen: boolean;
  /**
   * Callback to close the modal
   */
  onClose: () => void;
  /**
   * Callback to create the instance
   */
  onCreate: (name: string) => void;
}

const CreateInstance = (props: CreateInstanceProps): JSX.Element => {
  const { isLoading, isModalOpen, onClose, onCreate } = props;
  const [name, setName] = useState("");
  // @TODO Basic temporary error management. To be integrated with APIs errors.
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("openbridgeTempDictionary");

  const FORM_ID = "create-instance-form";

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (name === "") {
        setError("name-required");
      } else {
        setError(null);
        onCreate(name);
      }
    },
    [name, onCreate]
  );

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setError(value === "" ? "name-required" : null);
  }, []);

  const isNameMissing = error === "name-required" ? "error" : "default";

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setError(null);
    }
  }, [isModalOpen]);

  return (
    <Modal
      isOpen={isModalOpen}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance-modal"
      width={640}
      onClose={onClose}
      actions={[
        <Button
          key="submit"
          ouiaId="create-instance"
          variant="primary"
          type="submit"
          form={FORM_ID}
          isDisabled={isLoading}
          spinnerAriaValueText={t("common.submittingRequest")}
          isLoading={isLoading}
        >
          {t("instance.createSEInstance")}
        </Button>,
        <Button
          key="cancel"
          ouiaId="cancel-instance-modal"
          variant="link"
          onClick={onClose}
        >
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        <FormGroup
          label={t("common.name")}
          isRequired
          fieldId="instance-name"
          validated={isNameMissing}
          helperTextInvalid={t("common.required")}
        >
          <TextInput
            isRequired
            ouiaId="new-instance-name"
            type="text"
            maxLength={255}
            id="instance-name"
            name="instance-name"
            value={name}
            onChange={handleNameChange}
            validated={isNameMissing}
            isDisabled={isLoading}
          />
        </FormGroup>
        <AlertGroup>
          <Alert
            variant="info"
            ouiaId="info-instance-available-soon"
            isInline={true}
            isPlain={true}
            title={t("instance.instanceWillBeAvailableShortly")}
          />
        </AlertGroup>
      </Form>
    </Modal>
  );
};

export default CreateInstance;
