import {
  Bullseye,
  Button,
  Modal,
  ModalBoxBody,
  ModalVariant,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import React from "react";
import { useTranslation } from "react-i18next";

export interface ActionModalProps {
  /** Action to execute when the modal gets closed */
  action: () => void;
  /** Message to display in the modal body */
  message: string;
  /** Optional ouia identifier */
  ouiaId?: string;
  /** Flag to show/hide the modal */
  showDialog: boolean;
  /** Modal title */
  title: string;
}

export const ActionModal = ({
  action,
  message,
  ouiaId,
  showDialog,
  title,
}: ActionModalProps): JSX.Element => {
  const { t } = useTranslation("openbridgeTempDictionary");

  return (
    <Modal
      ouiaId={ouiaId}
      variant={ModalVariant.small}
      title={title}
      titleIconVariant="warning"
      isOpen={showDialog}
      onClose={action}
      actions={[
        <Button ouiaId="close" key="close" onClick={action}>
          {t("common.close")}
        </Button>,
      ]}
    >
      <ModalBoxBody>
        <Bullseye height={100}>
          <TextContent>
            <Text component={TextVariants.p}>{message}</Text>
          </TextContent>
        </Bullseye>
      </ModalBoxBody>
    </Modal>
  );
};
