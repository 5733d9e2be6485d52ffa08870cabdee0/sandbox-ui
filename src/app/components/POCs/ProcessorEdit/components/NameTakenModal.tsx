import React, { VoidFunctionComponent } from "react";
import WarningModal from "@app/components/WarningModal/WarningModal";
import { Trans, useTranslation } from "@rhoas/app-services-ui-components";
import { Text, TextContent, TextVariants } from "@patternfly/react-core";

interface NameTakenModalProps {
  processorName: string;
  onClose: () => void;
}

const NameTakenModal: VoidFunctionComponent<NameTakenModalProps> = ({
  processorName,
  onClose,
}) => {
  const { t } = useTranslation("smartEventsTempDictionary");

  return (
    <WarningModal
      title={t("processor.errors.nameAlreadyTaken")}
      onClose={onClose}
    >
      <TextContent>
        <Text component={TextVariants.p}>
          <Trans
            t={t}
            i18nKey={"processor.errors.nameAlreadyTakenDescription"}
            values={{ processorName }}
          />
        </Text>
        <Text component={TextVariants.p}>
          {t("processor.errors.pleaseFixNameAndTryAgain")}
        </Text>
      </TextContent>
    </WarningModal>
  );
};

export default NameTakenModal;
