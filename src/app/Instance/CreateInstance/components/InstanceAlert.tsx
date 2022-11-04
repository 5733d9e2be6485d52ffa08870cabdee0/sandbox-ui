import React, { useMemo, VoidFunctionComponent } from "react";
import { Alert, AlertProps, FormAlert } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { CreateInstanceError } from "@app/Instance/CreateInstance/types";

interface InstanceAlertProps {
  isFormInvalid: boolean;
  creationError?: CreateInstanceError;
}

const InstanceAlert: VoidFunctionComponent<InstanceAlertProps> = (props) => {
  const { isFormInvalid, creationError } = props;
  const { t } = useTranslation("smartEventsTempDictionary");

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
      case "quota-error":
        return (
          <ShowAlert
            title={t("instance.errors.instanceQuotaExceeded")}
            body={t("instance.quotaExceededErrorDescription")}
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
        if (isFormInvalid) {
          return (
            <ShowAlert title={t("common.addressFormErrors")} variant="danger" />
          );
        }
        return null;
    }
  }, [creationError, t, isFormInvalid]);

  return <>{alert}</>;
};

export default InstanceAlert;

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
        className="create-bridge-error"
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
