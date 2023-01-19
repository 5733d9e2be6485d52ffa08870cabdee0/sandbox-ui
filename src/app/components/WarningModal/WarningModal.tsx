import React, { VoidFunctionComponent } from "react";
import {
  Button,
  Modal,
  ModalProps,
  ModalVariant,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

interface WarningModalProps {
  title: string;
  titleIconVariant?: ModalProps["titleIconVariant"];
  variant?: ModalProps["variant"];
  closeButtonLabel?: string;
  onClose: () => void;
  children: React.ReactNode;
  isOpen?: boolean;
  ouiaId?: string;
}

const WarningModal: VoidFunctionComponent<WarningModalProps> = (props) => {
  const { t } = useTranslation("smartEventsTempDictionary");

  const {
    title,
    titleIconVariant = "danger",
    variant = ModalVariant.small,
    closeButtonLabel = t("common.close"),
    onClose,
    children,
    ouiaId = "warning-modal",
    isOpen = true,
  } = props;

  return (
    <Modal
      ouiaId={ouiaId}
      variant={variant}
      title={title}
      titleIconVariant={titleIconVariant}
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={onClose}>
          {closeButtonLabel}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default WarningModal;
