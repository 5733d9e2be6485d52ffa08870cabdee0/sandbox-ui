import React, { useMemo, VoidFunctionComponent } from "react";
import { Alert, AlertProps, FormAlert } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { CreateBridgeError } from "@app/Instance/CreateBridge/types";

interface BridgeAlertProps {
  isFormInvalid: boolean;
  creationError?: CreateBridgeError;
}

const BridgeAlert: VoidFunctionComponent<BridgeAlertProps> = (props) => {
  const { isFormInvalid, creationError } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  const alert = useMemo(() => {
    switch (creationError) {
      case "name-taken":
        return (
          <ShowAlert title={t("common.addressFormErrors")} variant="danger" />
        );
      case "region-unavailable":
        return (
          <ShowAlert
            title={t("instance.creationTemporaryUnavailable")}
            body={t("instance.cloudRegionsUnavailable")}
            variant="warning"
          />
        );
      case "generic-error":
        return (
          <ShowAlert
            title={t("instance.errors.cantCreateInstance")}
            variant="danger"
          />
        );
      default:
        return (
          <ShowAlert title={t("common.addressFormErrors")} variant="danger" />
        );
    }
  }, [creationError, t]);

  return <>{isFormInvalid && alert}</>;
};

export default BridgeAlert;

interface ShowAlertProps {
  title: string;
  body?: string;
  variant: AlertProps["variant"];
}

const ShowAlert: VoidFunctionComponent<ShowAlertProps> = (props) => {
  const { title, body, variant } = props;
  return (
    <FormAlert>
      <Alert
        ouiaId="error-instance-create-fail"
        className="error-instance-create-fail"
        variant={variant}
        title={title}
        aria-live="polite"
        isInline
      >
        {body ? <p>{body}</p> : null}
      </Alert>
    </FormAlert>
  );
};
