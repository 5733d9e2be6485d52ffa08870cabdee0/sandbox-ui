import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import { Action } from "@openapi/generated";
import { useValidationBase } from "@app/Processor/ProcessorEdit/useValidationBase";
import { useValidateConfigParams } from "@app/Processor/ProcessorEdit/useValidateConfigParams";
import { ConfigType } from "../../../../types/Processor";

interface ActionEditProps {
  action?: Action;
  onChange: (action: Action) => void;
  registerValidation: (validationFunction: () => boolean) => void;
}

const ActionEdit = (props: ActionEditProps): JSX.Element => {
  const { action, onChange, registerValidation } = props;
  const [type, setType] = useState(action?.type ?? "");
  const [parameters, setParameters] = useState(action?.parameters ?? {});
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const { isRequired, isHTTPUrl } = useValidationBase();

  const updateConfiguration = (parameters: Action["parameters"]): void => {
    setParameters(parameters);
    onChange({
      type,
      parameters,
    });
  };

  const actionTypes: ConfigType[] = [
    {
      value: "",
      label: t("processor.selectAction"),
      isPlaceholder: true,
      fields: [],
    },
    {
      value: "KafkaTopic",
      label: t("processor.actions.KafkaTopic"),
      isPlaceholder: false,
      fields: [
        {
          name: "topic",
          label: t("common.kafkaTopic"),
          validate: isRequired,
        },
      ],
    },
    {
      value: "Webhook",
      label: t("processor.actions.Webhook"),
      isPlaceholder: false,
      fields: [
        {
          name: "endpoint",
          label: t("common.endpoint"),
          validate: isHTTPUrl,
        },
      ],
    },
    {
      value: "SendToBridge",
      label: t("processor.actions.SendToBridge"),
      isPlaceholder: false,
      fields: [
        {
          name: "bridgeId",
          label: t("instance.instanceId"),
          validate: isRequired,
        },
      ],
    },
    {
      value: "Slack",
      label: t("processor.actions.Slack"),
      isPlaceholder: false,
      fields: [
        {
          name: "channel",
          label: t("processor.channel"),
          validate: isRequired,
        },
        {
          name: "webhookUrl",
          label: t("processor.webhookUrl"),
          validate: isHTTPUrl,
        },
      ],
    },
  ];

  const { validate, validation, resetValidation, validateField } =
    useValidateConfigParams(action, actionTypes);

  const updateType = (type: string): void => {
    setType(type);
    const emptyParameters: { [key: string]: string } = {};
    switch (type) {
      case "KafkaTopic":
        emptyParameters.topic = "";
        break;
      case "Webhook":
        emptyParameters.endpoint = "";
        break;
      case "SendToBridge":
        emptyParameters.bridgeId = "";
        break;
      case "Slack":
        emptyParameters.channel = "";
        emptyParameters.webhookUrl = "";
        break;
    }
    onChange({
      type,
      parameters: emptyParameters,
    });
    if (type) {
      resetValidation("type");
    }
  };

  useEffect(() => {
    if (registerValidation) {
      registerValidation(validate);
    }
  }, [validate, registerValidation]);

  useEffect(() => {
    if (action) {
      setType(action.type);
      setParameters(action.parameters);
    }
  }, [action]);

  return (
    <>
      <FormGroup
        fieldId={`action-type`}
        label={t("processor.actionType")}
        isRequired={true}
        helperTextInvalid={validation.errors.type}
        validated={validation.errors.type ? "error" : "default"}
        className={validation.errors.type && "processor-field-error"}
      >
        <FormSelect
          id={`action-type`}
          aria-label={t("processor.actionType")}
          isRequired={true}
          value={type}
          onChange={(type: string): void => updateType(type)}
          validated={validation.errors.type ? "error" : "default"}
        >
          {actionTypes.map((option, index) => (
            <FormSelectOption
              key={index}
              value={option.value}
              label={option.label}
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
            name="action-config"
            aria-describedby="action-config"
            isDisabled={true}
          />
        </FormGroup>
      )}
      {type !== "" && (
        <>
          {actionTypes
            .find((actionType) => actionType.value === type)
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
                    validated={
                      validation.errors[field.name] ? "error" : "default"
                    }
                    onChange={(value: string): void => {
                      updateConfiguration({
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

export default ActionEdit;
