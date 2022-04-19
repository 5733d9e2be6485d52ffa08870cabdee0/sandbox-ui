import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import { BaseSource } from "../../../../types/Processor";

interface SourceEditProps {
  source?: BaseSource;
  onChange: (source: BaseSource) => void;
}

const SourceEdit = (props: SourceEditProps): JSX.Element => {
  const { source, onChange } = props;
  const [type, setType] = useState(source?.type ?? "");
  const [parameters, setParameters] = useState(source?.parameters ?? {});

  const updateType = (type: string): void => {
    setType(type);
    onChange({
      ...source,
      type: type,
      parameters,
    });
  };

  const updateParameters = (parameters: BaseSource["parameters"]): void => {
    setParameters(parameters);
    onChange({
      ...source,
      type: type,
      parameters,
    });
  };

  const { t } = useTranslation(["openbridgeTempDictionary"]);

  const sourceTypes = [
    {
      value: "",
      label: t("processor.selectSource"),
      isPlaceholder: true,
    },
    { value: "demoSource", label: "Demo Source", isPlaceholder: false },
  ];

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
      >
        <FormSelect
          id={`source-type`}
          aria-label={t("processor.sourceType")}
          isRequired={true}
          value={type}
          onChange={(type: string): void => updateType(type)}
        >
          {sourceTypes.map(
            (option, index): JSX.Element => (
              <FormSelectOption
                key={index}
                value={option.value}
                label={option.label}
                isPlaceholder={option.isPlaceholder}
              />
            )
          )}
        </FormSelect>
      </FormGroup>
      <FormGroup
        fieldId="source-parameters"
        label={t("processor.sourceConfiguration")}
        isRequired={type !== ""}
      >
        <TextInput
          type="text"
          id="source-parameters"
          name="source-parameters"
          aria-describedby="source-parameters"
          isRequired={type !== ""}
          isDisabled={type === ""}
          value={parameters.config}
          onChange={(value: string): void => {
            updateParameters({
              ...parameters,
              config: value,
            });
          }}
        />
      </FormGroup>
    </>
  );
};

export default SourceEdit;
