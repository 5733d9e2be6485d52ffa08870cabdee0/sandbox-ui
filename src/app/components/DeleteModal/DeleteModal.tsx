import React, { ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
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

export interface DeleteModalProps {
  /** Component ID according to the OUIA standard */
  ouiaId: string;
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
  blockedDeletionReason?: string | ReactElement;
}

export const DeleteModal = (props: DeleteModalProps): JSX.Element => {
  const {
    ouiaId,
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
  const { t } = useTranslation("openbridgeTempDictionary");
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
      ouiaId="confirm"
      key="confirm"
      variant="danger"
      isDisabled={!canDelete || isLoading}
      isLoading={isLoading}
      onClick={onConfirmDelete}
    >
      {t("common.delete")}
    </Button>,
    <Button
      ouiaId="cancel"
      key="cancel"
      variant="link"
      onClick={onCancelDelete}
      isDisabled={isLoading}
    >
      {t("common.cancel")}
    </Button>,
  ];

  const closeActions = [
    <Button ouiaId="close" key="close" onClick={onCancelDelete}>
      {t("common.close")}
    </Button>,
  ];

  return (
    <Modal
      ouiaId={ouiaId}
      variant={ModalVariant.small}
      title={modalTitle}
      titleIconVariant={blockedDeletionReason ? "danger" : "warning"}
      isOpen={showDialog}
      onClose={onCancel}
      actions={blockedDeletionReason ? closeActions : deleteActions}
    >
      <ModalBoxBody>
        {isPreloading && (
          <Bullseye className={"delete-modal-body__bullseye"}>
            <Spinner isSVG size="lg" aria-label={t("common.loading")} />
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
                  <Trans
                    i18nKey={
                      "openbridgeTempDictionary:common.resourceWillBeDeletedHTML"
                    }
                    values={{
                      type: resourceType,
                      name: resourceName,
                    }}
                  />
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form onSubmit={(event): void => event.preventDefault()}>
                <FormGroup
                  label={
                    <Trans
                      i18nKey={
                        "openbridgeTempDictionary:common.typeNameToConfirmHTML"
                      }
                      values={{
                        name: resourceName,
                      }}
                    />
                  }
                  fieldId="delete-confirmation-value"
                >
                  <TextInput
                    id="delete-confirmation-value"
                    ouiaId="delete-confirmation-value"
                    value={nameValue}
                    type="text"
                    onChange={setNameValue}
                    isDisabled={isLoading}
                    aria-label="delete-confirmation-value"
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
