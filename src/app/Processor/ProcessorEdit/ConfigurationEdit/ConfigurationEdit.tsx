import React, { useEffect, useRef, useState } from "react";
import { Action, Source } from "@openapi/generated";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { schema } from "../ConfigurationForm/schema";

type ConfigurationEditProps = ActionConfig | SourceConfig;

const ConfigurationEdit = (props: ConfigurationEditProps): JSX.Element => {
  const { configType, onChange, registerValidation, readOnly = false } = props;
  const [type, setType] = useState(
    (configType === "action" ? props.action?.type : props.source?.type) ?? ""
  );
  const [parameters, setParameters] = useState(
    (configType === "action"
      ? props.action?.parameters
      : props.source?.parameters) ?? {}
  );
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const [typeValidation, setTypeValidation] = useState<boolean>();

  const updateType = (type: string): void => {
    setType(type);
    const emptyParameters: { [key: string]: string } = {};
    onChange({
      type,
      parameters: emptyParameters,
    });
    if (type) {
      setTypeValidation(true);
    }
  };

  const updateConfiguration = (parameters: { [key: string]: string }): void => {
    setParameters(parameters);
    onChange({
      type,
      parameters,
    });
  };
  const validateParameters = useRef<(() => boolean) | undefined>();

  const registerValidateParameters = (callback: () => boolean): void => {
    validateParameters.current = callback;
  };

  const validate = (): boolean => {
    const isTypeValid = type !== "";
    setTypeValidation(isTypeValid);
    return (validateParameters.current?.() ?? false) && isTypeValid;
  };

  useEffect(() => {
    if (props.configType === "action" && props.action) {
      setType(props.action.type);
      setParameters(props.action.parameters);
    }
    if (props.configType === "source" && props.source) {
      setType(props.source.type);
      setParameters(props.source.parameters);
    }
  }, [props]);

  const typeOptions = [
    {
      id: "placeholder",
      name: "",
      isPlaceholder: true,
    },
    {
      id: "webhook_sink_0.1",
      name: "Webhook",
      isPlaceholder: false,
    },
  ];

  registerValidation(validate);

  return (
    <>
      <FormGroup
        fieldId={`action-type`}
        label={t("processor.actionType")}
        isRequired={true}
        helperTextInvalid={t("common.required")}
        validated={typeValidation === false ? "error" : "default"}
        className={typeValidation === false ? "processor-field-error" : ""}
      >
        <FormSelect
          id={`action-type`}
          ouiaId="action-type"
          aria-label={t("processor.actionType")}
          isRequired={true}
          value={type}
          onChange={(type: string): void => updateType(type)}
          validated={typeValidation === false ? "error" : "default"}
          isDisabled={readOnly}
        >
          {typeOptions.map((option) => (
            <FormSelectOption
              key={option.id}
              value={option.id}
              label={option.name}
              isPlaceholder={option.isPlaceholder}
            />
          ))}
        </FormSelect>
      </FormGroup>
      {type === "" && (
        <FormGroup
          fieldId={`action-config`}
          label={t("processor.actionConfiguration")}
        >
          <TextInput
            type="text"
            id="action-config"
            ouiaId="missing-actions"
            name="action-config"
            aria-describedby="action-config"
            isDisabled={true}
          />
        </FormGroup>
      )}
      {type !== "" && (
        <ConfigurationForm
          configuration={parameters}
          schema={schema}
          onChange={updateConfiguration}
          registerValidation={registerValidateParameters}
          readOnly={readOnly}
        />
      )}
    </>
  );
};

export default ConfigurationEdit;

interface ActionConfig extends BaseConfig {
  configType: "action";
  action?: Action;
  onChange: (action: Action) => void;
}

interface SourceConfig extends BaseConfig {
  configType: "source";
  source?: Source;
  onChange: (source: Source) => void;
}

interface BaseConfig {
  registerValidation: (validationFunction: () => boolean) => void;
  readOnly?: boolean;
}
