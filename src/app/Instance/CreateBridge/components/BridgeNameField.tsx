import React, { VoidFunctionComponent } from "react";
import { FormGroup, TextInput } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

interface BridgeNameFieldProps {
  value: string;
  isNameEmpty: boolean;
  onChange: (name: string) => void;
}

const BridgeNameField: VoidFunctionComponent<BridgeNameFieldProps> = (
  props
) => {
  const { isNameEmpty, onChange, value } = props;
  const { t } = useTranslation("openbridgeTempDictionary");

  return (
    <FormGroup
      label={t("common.name")}
      isRequired
      fieldId="instance-name"
      validated={isNameEmpty ? "error" : "default"}
      helperTextInvalid={t("common.required")}
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
        validated={isNameEmpty ? "error" : "default"}
        // isDisabled={formIsDisabled}
      />
    </FormGroup>
  );
};

export default BridgeNameField;
