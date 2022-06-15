import React, { useEffect, useRef, useState } from "react";
import {
  Action,
  ProcessorSchemaEntryResponse,
  Source,
} from "@openapi/generated";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { GetSchema } from "../../../../hooks/useSchemasApi/useGetSchemaApi";
import { ProcessorSchemaType } from "../../../../types/Processor";

type ConfigurationEditProps = ActionConfig | SourceConfig;

const ConfigurationEdit = (props: ConfigurationEditProps): JSX.Element => {
  const {
    configType,
    onChange,
    registerValidation,
    readOnly = false,
    schemaCatalog,
    getSchema,
  } = props;
  const [type, setType] = useState(
    (configType === "action" ? props.action?.type : props.source?.type) ?? ""
  );
  const [schema, setSchema] = useState<object>();
  const [schemaLoading, setSchemaLoading] = useState(false);
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

  useEffect(() => {
    if (type) {
      setSchemaLoading(true);
      setSchema(undefined);
      getSchema(type, configType)
        .then((data) => setSchema(data))
        // @TODO: decide how to manage error while fetching a schema
        .catch((error) => console.log(error))
        .finally(() => setSchemaLoading(false));
    }
  }, [type, getSchema, configType]);

  const typeOptions = [
    {
      name: "",
      label: t(
        configType === ProcessorSchemaType.ACTION
          ? "processor.selectAction"
          : "processor.selectSource"
      ),
      isPlaceholder: true,
    },
    ...(schemaCatalog ? getOptions(schemaCatalog, configType) : []),
  ];

  registerValidation(validate);

  return (
    <>
      <FormGroup
        fieldId={`${configType}-type`}
        label={t(`processor.${configType}Type`)}
        isRequired={true}
        helperTextInvalid={t("common.required")}
        validated={typeValidation === false ? "error" : "default"}
        className={typeValidation === false ? "processor-field-error" : ""}
      >
        <FormSelect
          id={`${configType}-type`}
          ouiaId={`${configType}-type`}
          aria-label={t(`processor.${configType}Type`)}
          isRequired={true}
          value={type}
          onChange={(type: string): void => updateType(type)}
          validated={typeValidation === false ? "error" : "default"}
          isDisabled={readOnly}
        >
          {typeOptions.map((option, index) => (
            <FormSelectOption
              key={index}
              value={option.name}
              label={option.label}
              isPlaceholder={option.isPlaceholder}
            />
          ))}
        </FormSelect>
      </FormGroup>
      {(type === "" || schemaLoading) && (
        <FormGroup
          fieldId={`${configType}-config`}
          label={t(`processor.${configType}Configuration`)}
        >
          <TextInput
            type="text"
            id={`${configType}-config`}
            ouiaId={`missing-${configType}s`}
            name={`${configType}-config`}
            aria-describedby={`${configType}-config`}
            isDisabled={true}
          />
        </FormGroup>
      )}
      {type !== "" && schema && !schemaLoading && (
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
  configType: ProcessorSchemaType.ACTION;
  action?: Action;
  onChange: (action: Action) => void;
}

interface SourceConfig extends BaseConfig {
  configType: ProcessorSchemaType.SOURCE;
  source?: Source;
  onChange: (source: Source) => void;
}

interface BaseConfig {
  registerValidation: (validationFunction: () => boolean) => void;
  readOnly?: boolean;
  schemaCatalog: ProcessorSchemaEntryResponse[] | undefined;
  getSchema: GetSchema;
}

const getOptions = (
  catalog: ProcessorSchemaEntryResponse[],
  type: string
): Array<{ name: string; label: string; isPlaceholder: boolean }> => {
  return catalog
    .filter((schema) => schema?.type === type)
    .map((schema) => ({
      name: schema?.id ?? "",
      label: schema?.name ?? "",
      isPlaceholder: false,
    }));
};
