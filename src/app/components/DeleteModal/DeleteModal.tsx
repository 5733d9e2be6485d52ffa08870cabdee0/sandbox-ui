import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bullseye,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBoxBody,
  ModalVariant,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  ValidatedOptions,
} from "@patternfly/react-core";
import "./DeleteModal.css";

interface DeleteModalProps {
  /** Flag to show/hide the modal */
  showDialog: boolean;
  /** The title of the modal */
  modalTitle: string;
  /** The name of the resource to delete */
  resourceName: string | undefined;
  /** The type of the resource to delete (i.e. "Processor" or "Smart Event Instance" etc.) */
  resourceType: string | undefined;
  /** Callback executed when the deletion is canceled */
  onCancel: () => void;
  /** Callback executed when the deletion is confirmed */
  onConfirm: () => void;
  /** Flag to indicate if the deletion is in progress */
  isLoading: boolean;
  /** Flag to indicate if a preload is in progress to check if the deletion is possible */
  isPreloading: boolean;
  /** Reason why the deletion is not possible */
  blockedDeletionReason?: string;
}

export const DeleteModal = (props: DeleteModalProps): JSX.Element => {
  const {
    modalTitle,
    resourceName,
    resourceType,
    onCancel,
    onConfirm,
    showDialog,
    isPreloading,
    isLoading,
    blockedDeletionReason,
  } = props;
  const { t } = useTranslation();
  const [nameValue, setNameValue] = useState("");
  const canDelete = nameValue === resourceName;

  const onCancelDelete = (): void => {
    setNameValue("");
    onCancel();
  };

  const onConfirmDelete = (): void => {
    onConfirm();
  };

  useEffect(() => {
    setNameValue("");
  }, [resourceName]);

  const deleteActions = [
    <Button
      key="confirm"
      variant="danger"
      isDisabled={!canDelete || isLoading}
      isLoading={isLoading}
      onClick={onConfirmDelete}
    >
      {t("delete")}
    </Button>,
    <Button
      key="cancel"
      variant="link"
      onClick={onCancelDelete}
      isDisabled={isLoading}
    >
      {t("cancel")}
    </Button>,
  ];

  const closeActions = [
    <Button key="close" onClick={onCancelDelete}>
      {t("close")}
    </Button>,
  ];

  return (
    <Modal
      variant={ModalVariant.small}
      title={modalTitle}
      titleIconVariant="warning"
      isOpen={showDialog}
      onClose={onCancel}
      actions={blockedDeletionReason ? closeActions : deleteActions}
    >
      <ModalBoxBody>
        {isPreloading && (
          <Bullseye className={"delete-modal-body__bullseye"}>
            <Spinner isSVG size="lg" aria-label="Loading" />
          </Bullseye>
        )}
        {!isPreloading && blockedDeletionReason && (
          <Bullseye className={"delete-modal-body__bullseye"}>
            <TextContent>
              <Text component={TextVariants.p}>{blockedDeletionReason}</Text>
            </TextContent>
          </Bullseye>
        )}
        {!isPreloading && !blockedDeletionReason && (
          <Stack hasGutter={true}>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.p}>
                  {resourceType} <strong>{resourceName}</strong> will be
                  deleted.
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form onSubmit={(event): void => event.preventDefault()}>
                <FormGroup
                  label={
                    <>
                      Type <em>{resourceName}</em> to confirm the deletion.
                    </>
                  }
                  fieldId="delete-confirmation-value"
                >
                  <TextInput
                    id="delete-confirmation-value"
                    value={nameValue}
                    type="text"
                    onChange={setNameValue}
                    isDisabled={isLoading}
                    aria-label="name input"
                    autoComplete={"off"}
                    validated={
                      canDelete
                        ? ValidatedOptions.success
                        : ValidatedOptions.default
                    }
                  />
                </FormGroup>
              </Form>
            </StackItem>
          </Stack>
        )}
      </ModalBoxBody>
    </Modal>
  );
};
