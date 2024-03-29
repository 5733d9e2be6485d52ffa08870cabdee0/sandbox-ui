import React, { VoidFunctionComponent } from "react";
import { FormGroup, TextInput } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

interface InstanceNameFieldProps {
  value: string;
  isNameInvalid: boolean;
  isNameTaken: boolean;
  onChange: (name: string) => void;
  isDisabled: boolean;
}

const InstanceNameField: VoidFunctionComponent<InstanceNameFieldProps> = (
  props
) => {
  const { isNameInvalid, isNameTaken, onChange, value, isDisabled } = props;
  const { t } = useTranslation("smartEventsTempDictionary");

  const isInvalid = isNameInvalid || isNameTaken;
  const errorMessage = isNameTaken
    ? t("instance.errors.invalidName")
    : isNameInvalid
    ? t("common.required")
    : "";

  return (
    <FormGroup
      label={t("common.name")}
      isRequired
      fieldId="instance-name"
      validated={isInvalid ? "error" : "default"}
      helperTextInvalid={errorMessage}
      className={isInvalid ? "instance-field-error" : ""}
    >
      <TextInput
        isRequired
        ouiaId="new-name"
        type="text"
        maxLength={255}
        id="instance-name"
        name="instance-name"
        value={value}
        onChange={onChange}
        validated={isInvalid ? "error" : "default"}
        isDisabled={isDisabled}
      />
    </FormGroup>
  );
};

export default InstanceNameField;
