import React, { VoidFunctionComponent } from "react";
import WarningModal from "@app/components/WarningModal/WarningModal";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { Text, TextContent, TextVariants } from "@patternfly/react-core";

interface GenericErrorModalProps {
  onClose: () => void;
}

const GenericErrorModal: VoidFunctionComponent<GenericErrorModalProps> = ({
  onClose,
}) => {
  const { t } = useTranslation("smartEventsTempDictionary");

  return (
    <WarningModal title={t("common.somethingWentWrong")} onClose={onClose}>
      <TextContent>
        <Text component={TextVariants.p}>
          {t("processor.errors.cantCreateProcessor")}
        </Text>
      </TextContent>
    </WarningModal>
  );
};

export default GenericErrorModal;
