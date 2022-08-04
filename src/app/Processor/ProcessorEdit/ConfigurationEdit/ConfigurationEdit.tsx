import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Action,
  ProcessorSchemaEntryResponse,
  Source,
} from "@rhoas/smart-events-management-sdk";
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
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ActionModal } from "@app/components/ActionModal/ActionModal";
import { useHistory, useParams } from "react-router-dom";
import { InstanceRouteParams } from "@app/Instance/InstancePage/InstancePage";

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

  const history = useHistory();
  const { instanceId } = useParams<InstanceRouteParams>();

  const [type, setType] = useState(
    (configType === ProcessorSchemaType.ACTION
      ? props.action?.type
      : props.source?.type) ?? ""
  );
  const [schema, setSchema] = useState<object>();
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [parameters, setParameters] = useState(
    (configType === ProcessorSchemaType.ACTION
      ? props.action?.parameters
      : props.source?.parameters) ?? {}
  );

  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const actionModalMessage = useRef<string>("");
  const actionModalFn = useRef<() => void>((): void =>
    setShowActionModal(false)
  );

  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const [typeValidation, setTypeValidation] = useState<boolean>();

  const updateType = useCallback(
    (type: string): void => {
      setType(type);
      const emptyParameters: object = {};
      onChange({
        type,
        parameters: emptyParameters,
      });
      if (type) {
        setTypeValidation(true);
      }
    },
    [onChange]
  );

  const updateConfiguration = (parameters: object): void => {
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
    if (props.configType === ProcessorSchemaType.ACTION && props.action) {
      setType(props.action.type);
      setParameters(props.action.parameters);
    }
    if (props.configType === ProcessorSchemaType.SOURCE && props.source) {
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
        .catch((error) => {
          if (error && axios.isAxiosError(error)) {
            if (
              isServiceApiError(error) &&
              getErrorCode(error) === APIErrorCodes.ERROR_4
            ) {
              setShowActionModal(true);
              actionModalFn.current = (): void => {
                setShowActionModal(false);
                updateType("");
              };
              actionModalMessage.current = t(
                "processor.errors.cantCreateProcessorOfThatType"
              );
            } else {
              setShowActionModal(true);
              actionModalFn.current = (): void => {
                setShowActionModal(false);
                history.replace(`/instance/${instanceId}`);
              };
              actionModalMessage.current = t("common.tryAgainLater");
            }
          }
        })
        .finally(() => setSchemaLoading(false));
    }
  }, [configType, getSchema, history, instanceId, t, type, updateType]);

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
    ...getOptions(schemaCatalog, configType),
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
      <ActionModal
        action={actionModalFn.current}
        message={actionModalMessage.current}
        showDialog={showActionModal}
        title={t("processor.errors.cantCreateProcessor")}
      />
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
  schemaCatalog: ProcessorSchemaEntryResponse[];
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
