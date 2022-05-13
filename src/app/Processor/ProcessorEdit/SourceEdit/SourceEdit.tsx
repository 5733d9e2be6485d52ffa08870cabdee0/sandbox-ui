import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import { useValidationBase } from "@app/Processor/ProcessorEdit/useValidationBase";
import { Source } from "@openapi/generated";
import { useValidateConfigParams } from "@app/Processor/ProcessorEdit/useValidateConfigParams";
import { ConfigType } from "../../../../types/Processor";

interface SourceEditProps {
  source?: Source;
  onChange: (source: Source) => void;
  registerValidation: (validationFunction: () => boolean) => void;
}

const SourceEdit = (props: SourceEditProps): JSX.Element => {
  const { source, onChange, registerValidation } = props;
  const [type, setType] = useState(source?.type ?? "");
  const [parameters, setParameters] = useState(source?.parameters ?? {});

  const updateType = (type: string): void => {
    setType(type);
    const emptyParameters: { [key: string]: string } = {};
    switch (type) {
      case "Slack":
        emptyParameters.channel = "";
        emptyParameters.token = "";
        break;
    }
    onChange({
      ...source,
      type: type,
      parameters: emptyParameters,
    });
    if (type) {
      resetValidation("type");
    }
  };

  const updateParameters = (parameters: Source["parameters"]): void => {
    setParameters(parameters);
    onChange({
      ...source,
      type: type,
      parameters,
    });
  };

  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const { isRequired } = useValidationBase();

  const sourceTypes: ConfigType[] = [
    {
      name: "",
      label: t("processor.selectSource"),
      isPlaceholder: true,
      fields: [],
    },
    {
      name: "Slack",
      label: t("processor.sources.Slack"),
      isPlaceholder: false,
      fields: [
        {
          name: "channel",
          label: t("processor.channel"),
          validate: isRequired,
        },
        {
          name: "token",
          label: t("processor.token"),
          validate: isRequired,
        },
      ],
    },
  ];

  const { validate, validation, resetValidation, validateField } =
    useValidateConfigParams(source, sourceTypes);

  useEffect(() => {
    if (registerValidation) {
      registerValidation(validate);
    }
  }, [validate, registerValidation]);

  useEffect((): void => {
    if (source) {
      setType(source.type);
      setParameters(source.parameters);
    }
  }, [source]);

  return (
    <>
      <FormGroup
        fieldId={`source-type`}
        label={t("processor.sourceType")}
        isRequired={true}
        helperTextInvalid={validation.errors.type}
        validated={validation.errors.type ? "error" : "default"}
        className={validation.errors.type && "processor-field-error"}
      >
        <FormSelect
          id={`source-type`}
          aria-label={t("processor.sourceType")}
          isRequired={true}
          value={type}
          onChange={(type: string): void => updateType(type)}
          validated={validation.errors.type ? "error" : "default"}
        >
          {sourceTypes.map(
            (option, index): JSX.Element => (
              <FormSelectOption
                key={index}
                value={option.name}
                label={option.label}
                isPlaceholder={option.isPlaceholder}
              />
            )
          )}
        </FormSelect>
      </FormGroup>
      {type === "" && (
        <FormGroup
          fieldId="source-parameters"
          label={t("processor.sourceConfiguration")}
        >
          <TextInput
            type="text"
            id="source-parameters"
            name="source-parameters"
            aria-describedby="source-parameters"
            isDisabled={true}
          />
        </FormGroup>
      )}
      {type !== "" && (
        <>
          {sourceTypes
            .find((sourceType) => sourceType.name === type)
            ?.fields.map((field) => {
              return (
                <FormGroup
                  key={field.name}
                  fieldId={field.name}
                  label={field.label}
                  isRequired={true}
                  helperTextInvalid={validation.errors[field.name]}
                  validated={
                    validation.errors[field.name] ? "error" : "default"
                  }
                  className={
                    validation.errors[field.name] && "processor-field-error"
                  }
                >
                  <TextInput
                    type="text"
                    id={field.name}
                    name={field.name}
                    aria-describedby={field.name}
                    isRequired={true}
                    value={parameters[field.name] ?? ""}
                    onChange={(value: string): void => {
                      updateParameters({
                        ...parameters,
                        [field.name]: value,
                      });
                    }}
                    onBlur={(): void => {
                      validateField(type, field.name);
                    }}
                  />
                </FormGroup>
              );
            })}
        </>
      )}
    </>
  );
};

export default SourceEdit;
