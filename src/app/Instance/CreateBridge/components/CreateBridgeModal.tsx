import React, { ReactNode, VoidFunctionComponent } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

interface CreateBridgeModalProps {
  children: ReactNode;
  formId: string;
  onClose: () => void;
  isSaving: boolean;
  isDisabled: boolean;
  isLoading: boolean;
}

const CreateBridgeModal: VoidFunctionComponent<CreateBridgeModalProps> = (
  props
) => {
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const { children, formId, onClose, isSaving, isDisabled, isLoading } = props;

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
          form={formId}
          isDisabled={isDisabled}
          spinnerAriaValueText={t("common.submittingRequest")}
          isLoading={isLoading}
        >
          {t("instance.createSEInstance")}
        </Button>,
        <Button
          key="cancel"
          ouiaId="cancel"
          variant="link"
          onClick={onClose}
          isDisabled={isSaving}
        >
          {t("common.cancel")}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default CreateBridgeModal;
