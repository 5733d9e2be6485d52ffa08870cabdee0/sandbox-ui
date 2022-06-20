import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Alert,
  AlertGroup,
  Button,
  Form,
  FormAlert,
  FormGroup,
  Modal,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";

export interface CreateInstanceProps {
  /** Flag to indicate the creation request is in progress */
  isLoading: boolean;
  /** Flag to show/hide the modal */
  isModalOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback to create the instance */
  onCreate: (name: string) => void;
  /** API error related to bridge creation */
  createBridgeError: unknown;
}

const CreateInstance = (props: CreateInstanceProps): JSX.Element => {
  const { isLoading, isModalOpen, onClose, onCreate, createBridgeError } =
    props;
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [genericError, setGenericError] = useState<string | null>(null);
  const [newBridgeName, setNewBridgeName] = useState("");
  const [existingInstanceName, setExistingInstanceName] = useState("");

  const { t } = useTranslation("openbridgeTempDictionary");

  const FORM_ID = "create-instance-form";

  const validate = useCallback(() => {
    if (name.trim() === "") {
      setError(t("common.required"));
      return false;
    }
    if (existingInstanceName && name.trim() === existingInstanceName) {
      setError(t("instance.errors.invalidName"));
      return false;
    }
    setError(null);
    setGenericError(null);
    return true;
  }, [name, t, existingInstanceName]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (validate()) {
        const newName = name.trim();
        onCreate(newName);
        setNewBridgeName(newName);
      }
    },
    [name, onCreate, validate]
  );

  const handleNameChange = useCallback(
    (name: string) => {
      setName(name);
      if (existingInstanceName) {
        validate();
      }
    },
    [existingInstanceName, validate]
  );

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setError(null);
      setGenericError(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (createBridgeError && axios.isAxiosError(createBridgeError)) {
      if (
        isServiceApiError(createBridgeError) &&
        getErrorCode(createBridgeError) === APIErrorCodes.ERROR_1
      ) {
        setExistingInstanceName(newBridgeName);
      } else {
        setGenericError(
          createBridgeError.response?.statusText ?? "Internal Server Error"
        );
      }
    }
  }, [createBridgeError, newBridgeName]);

  const getFormAlertError = (): string => {
    if (error) {
      return t("common.addressFormErrors");
    }

    return t("instance.errors.cantCreateInstance");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance"
      width={640}
      onClose={(): void => {
        setError(null);
        setGenericError(null);
        onClose();
      }}
      actions={[
        <Button
          key="submit"
          ouiaId="submit"
          variant="primary"
          type="submit"
          form={FORM_ID}
          isDisabled={isLoading}
          spinnerAriaValueText={t("common.submittingRequest")}
          isLoading={isLoading}
        >
          {t("instance.createSEInstance")}
        </Button>,
        <Button key="cancel" ouiaId="cancel" variant="link" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        {(error || genericError) && (
          <FormAlert>
            <Alert
              variant="danger"
              title={getFormAlertError()}
              aria-live="polite"
              isInline
            />
          </FormAlert>
        )}
        <FormGroup
          label={t("common.name")}
          isRequired
          fieldId="instance-name"
          validated={error ? "error" : "default"}
          helperTextInvalid={error}
        >
          <TextInput
            isRequired
            ouiaId="new-name"
            type="text"
            maxLength={255}
            id="instance-name"
            name="instance-name"
            value={name}
            onChange={handleNameChange}
            onBlur={validate}
            validated={error ? "error" : "default"}
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
