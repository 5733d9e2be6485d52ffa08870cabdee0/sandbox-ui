import React, { VoidFunctionComponent } from "react";
import { FormGroup, TextInput } from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";

interface BridgeNameFieldProps {
  value: string;
  isNameEmpty: boolean;
  isNameTaken: boolean;
  onChange: (name: string) => void;
  isDisabled: boolean;
}

const BridgeNameField: VoidFunctionComponent<BridgeNameFieldProps> = (
  props
) => {
  const { isNameEmpty, isNameTaken, onChange, value, isDisabled } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  const validity = isNameEmpty || isNameTaken;
  const errorMessage = isNameTaken
    ? t("instance.errors.invalidName")
    : isNameEmpty
    ? t("common.required")
    : "";

  return (
    <FormGroup
      label={t("common.name")}
      isRequired
      fieldId="instance-name"
      validated={validity ? "error" : "default"}
      helperTextInvalid={errorMessage}
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
        // onBlur={validate}
        validated={validity ? "error" : "default"}
        isDisabled={isDisabled}
      />
    </FormGroup>
  );
};

export default BridgeNameField;
