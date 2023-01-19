import React, { VoidFunctionComponent } from "react";
import { Text, TextContent, TextVariants } from "@patternfly/react-core";
import { Trans, useTranslation } from "@rhoas/app-services-ui-components";
import WarningModal from "@app/components/WarningModal/WarningModal";

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
    <WarningModal
      title={t("processor.errors.syntaxError")}
      closeButtonLabel={t("processor.goBackToEditing")}
      onClose={onClose}
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
          <Trans
            t={t}
            i18nKey={"processor.errors.pleaseFixIssuesAndTryAgain"}
            count={errorsCount}
          />
        </Text>
      </TextContent>
    </WarningModal>
  );
};

export default DeployBlockedModal;
