import React, { VoidFunctionComponent } from "react";
import {
  Button,
  Modal,
  ModalVariant,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { Trans, useTranslation } from "@rhoas/app-services-ui-components";

interface DeployBlockedModalProps {
  errorsCount: number;
  onClose: () => void;
}

const DeployBlockedModal: VoidFunctionComponent<DeployBlockedModalProps> = (
  props
) => {
  const { errorsCount, onClose } = props;
  const { t } = useTranslation("smartEventsTempDictionary");

  return (
    <Modal
      variant={ModalVariant.small}
      title="Syntax error"
      titleIconVariant="danger"
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={onClose}>
          {t("processor.goBackToEditing")}
        </Button>,
      ]}
    >
      <TextContent>
        <Text component={TextVariants.p}>
          <Trans
            t={t}
            i18nKey={"processor.errors.cantDeployBecauseOfIssues"}
            count={errorsCount}
          />
        </Text>
        <Text component={TextVariants.p}>
          {t("processor.errors.pleaseFixIssuesAndTryAgain")}
        </Text>
      </TextContent>
    </Modal>
  );
};

export default DeployBlockedModal;
