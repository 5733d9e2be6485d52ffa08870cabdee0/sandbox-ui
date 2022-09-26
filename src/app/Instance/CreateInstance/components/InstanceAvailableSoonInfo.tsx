import React, { VoidFunctionComponent } from "react";
import { Alert, AlertGroup } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

const InstanceAvailableSoonInfo: VoidFunctionComponent = () => {
  const { t } = useTranslation("openbridgeTempDictionary");

  return (
    <AlertGroup style={{ marginTop: "var(--pf-global--spacer--lg)" }}>
      <Alert
        variant="info"
        ouiaId="info-instance-available-soon"
        isInline={true}
        isPlain={true}
        title={t("instance.instanceWillBeAvailableShortly")}
      />
    </AlertGroup>
  );
};

export default InstanceAvailableSoonInfo;
