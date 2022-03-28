import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";

interface SourceEditProps {
  source?: EventSource;
  onChange: (source: EventSource) => void;
}

const SourceEdit = (props: SourceEditProps) => {
  const { source, onChange } = props;
  const [type, setType] = useState(source?.type ?? "");
  const [parameters, setParameters] = useState(source?.parameters ?? {});

  const updateType = (type: string) => {
    setType(type);
    onChange({
      ...source,
      type: type,
      parameters,
    });
  };

  const updateParameters = (parameters: EventSource["parameters"]) => {
    setParameters(parameters);
    onChange({
      ...source,
      type: type,
      parameters,
    });
  };

  const { t } = useTranslation();

  const sourceTypes = [
    {
      value: "",
      label: t("openbridgeTempDictionary:processor.selectSource"),
      isPlaceholder: true,
    },
    { value: "demoSource", label: "Demo Source", isPlaceholder: false },
  ];

  useEffect(() => {
    if (source) {
      setType(source.type);
      setParameters(source.parameters);
    }
  }, [source]);

  return (
    <>
      <FormGroup
        fieldId={`source-type`}
        label={t("openbridgeTempDictionary:processor:sourceType")}
        isRequired={true}
      >
        <FormSelect
          id={`source-type`}
          aria-label={t("openbridgeTempDictionary:processor:sourceType")}
          isRequired={true}
          value={type}
          onChange={(type) => updateType(type)}
        >
          {sourceTypes.map((option, index) => (
            <FormSelectOption
              key={index}
              value={option.value}
              label={option.label}
              isPlaceholder={option.isPlaceholder}
            />
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup
        fieldId="source-parameters"
        label={t("openbridgeTempDictionary:common.configuration")}
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
          onChange={(value) => {
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

export interface EventSource {
  type: string;
  parameters: {
    [key: string]: string;
  };
}
