import React, { ReactNode, VoidFunctionComponent } from "react";
import { Button, Modal } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

interface CreateInstanceModalProps {
  children: ReactNode;
  formId: string;
  onClose: () => void;
  isSaving: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  appendTo?: () => HTMLElement;
}

const CreateInstanceModal: VoidFunctionComponent<CreateInstanceModalProps> = (
  props
) => {
  const { t } = useTranslation(["smartEventsTempDictionary"]);
  const {
    children,
    formId,
    onClose,
    isSaving,
    isDisabled,
    isLoading,
    appendTo,
  } = props;

  return (
    <Modal
      isOpen={true}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance"
      width={640}
      onClose={onClose}
      appendTo={appendTo}
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

export default CreateInstanceModal;
